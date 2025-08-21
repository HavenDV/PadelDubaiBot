import {
  MessageFormatter,
  REGISTRATION_BUTTONS,
  TelegramAPI,
} from "@/app/lib/telegram";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Booking, Location, User } from "../../../../database.types";

// Types for database booking with location
interface BookingWithLocation {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
  courts: number;
  note: string | null;
  cancelled: boolean | null;
  locations: {
    id: number;
    name: string;
    url: string;
  };
}

// Types for registrations with user data
interface RegistrationWithUser {
  id: number;
  users: {
    id: number;
    username: string | null;
    first_name: string;
    skill_level: string | null;
  };
}

export async function handleDatabaseRegistration(
  messageId: number,
  userId: number,
  userName: string,
  action: "join" | "leave",
  chatId: number
): Promise<{
  success: boolean;
  notification?: string;
  error?: string;
  updatedMessage?: string;
  userSkill?: string;
}> {
  try {
    // Find booking through messages table
    const { data: telegramMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("booking_id")
      .eq("message_id", messageId)
      .eq("chat_id", chatId)
      .single();

    if (messageError || !telegramMessage) {
      return { success: false, error: "Message not found" };
    }

    // Get booking data with location
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        locations:location_id (
          id,
          name,
          url
        )
      `
      )
      .eq("id", telegramMessage.booking_id)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    // Check if booking is cancelled
    if (booking.cancelled) {
      return { success: false, error: "This booking has been cancelled" };
    }

    // Ensure user exists in database and get their skill level
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from("users")
      .select("id, skill_level")
      .eq("id", userId)
      .single();

    let dbUserId: number;
    let userSkill: string | null = null;

    if (userCheckError || !existingUser) {
      // Create user if doesn't exist with default skill level "E"
      const { data: newUser, error: createUserError } = await supabaseAdmin
        .from("users")
        .insert({
          id: userId,
          username: userName.replace(/@|<a[^>]*>|<\/a>/g, "").trim(),
          first_name: userName.replace(/@|<a[^>]*>|<\/a>/g, "").trim(),
          skill_level: "E",
        })
        .select("id, skill_level")
        .single();

      if (createUserError || !newUser) {
        return { success: false, error: "Failed to create user" };
      }
      dbUserId = newUser.id;
      userSkill = newUser.skill_level;
    } else {
      dbUserId = existingUser.id;
      userSkill = existingUser.skill_level;
    }

    // If user somehow doesn't have a skill level, default to "E" as fallback
    if (action === "join" && !userSkill) {
      userSkill = "E";
    }

    // Handle leave action - remove registration
    if (action === "leave") {
      const { error: deleteError } = await supabaseAdmin
        .from("registrations")
        .delete()
        .eq("booking_id", booking.id)
        .eq("user_id", dbUserId);

      if (deleteError) {
        return { success: false, error: "Failed to remove registration" };
      }
    } else if (action === "join") {
      // Handle join action - add registration
      // First, remove any existing registration for this user (in case they're re-joining)
      await supabaseAdmin
        .from("registrations")
        .delete()
        .eq("booking_id", booking.id)
        .eq("user_id", dbUserId);

      // Add new registration
      const { error: insertError } = await supabaseAdmin
        .from("registrations")
        .insert({
          booking_id: booking.id,
          user_id: dbUserId,
        });

      if (insertError) {
        return { success: false, error: "Failed to register for booking" };
      }
    }

    // Get all current registrations for this booking with user skill levels
    const { data: registrations, error: regError } = await supabaseAdmin
      .from("registrations")
      .select(
        `
        id,
        users:user_id (
          id,
          username,
          first_name,
          skill_level
        )
      `
      )
      .eq("booking_id", booking.id)
      .order("created_at");

    if (regError) {
      return { success: false, error: "Failed to fetch registrations" };
    }

    // Generate updated message based on database state
    const updatedMessage = await generateMessageFromDatabase(
      booking,
      registrations || []
    );

    const cleanUserName = userName.replace(/@|<a[^>]*>|<\/a>/g, "").trim();
    const notification =
      action === "leave" ? `${cleanUserName} отменил участие` : undefined;

    return {
      success: true,
      updatedMessage,
      notification,
      userSkill: userSkill || undefined,
    };
  } catch (error) {
    console.error("Database registration error:", error);
    return { success: false, error: "Database error" };
  }
}

// Check late cancellation using DB booking times via message mapping
export async function isLateCancellationByMessage(
  chatId: number,
  messageId: number
): Promise<{ isLate: boolean; hoursRemaining: number | null }> {
  try {
    const { data: telegramMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("booking_id")
      .eq("message_id", messageId)
      .eq("chat_id", chatId)
      .single();

    if (messageError || !telegramMessage) {
      return { isLate: false, hoursRemaining: null };
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("start_time")
      .eq("id", telegramMessage.booking_id)
      .single();

    if (bookingError || !booking?.start_time) {
      return { isLate: false, hoursRemaining: null };
    }

    const now = new Date();
    const start = new Date(booking.start_time);
    const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return {
      isLate: diffHours < 24 && diffHours > 0,
      hoursRemaining: diffHours > 0 ? diffHours : null,
    };
  } catch {
    return { isLate: false, hoursRemaining: null };
  }
}

export async function generateMessageFromDatabase(
  booking: BookingWithLocation,
  registrations: RegistrationWithUser[]
): Promise<string> {
  // Normalize to DB types for formatter
  const dbBooking: Booking = {
    id: booking.id,
    location_id: booking.locations.id,
    start_time: booking.start_time,
    end_time: booking.end_time,
    price: booking.price,
    courts: booking.courts,
    note: booking.note,
    cancelled: booking.cancelled,
    created_at: null,
    updated_at: null,
  };
  const dbLocation: Location = {
    id: booking.locations.id,
    name: booking.locations.name,
    url: booking.locations.url,
    address: null,
    attributes: null,
    created_at: null,
    lat: null,
    lng: null,
    opening_hours: null,
    phone: null,
    place_id: null,
    plus_code: null,
    rating: null,
    updated_at: null,
    user_ratings_total: null,
    website: null,
  };
  const regs = registrations.map((r) => ({
    user: {
      id: r.users.id,
      username: r.users.username,
      first_name: r.users.first_name,
      skill_level: r.users.skill_level,
    } as Pick<User, "id" | "username" | "first_name" | "skill_level">,
  }));

  return MessageFormatter.formatBookingMessage({
    booking: dbBooking,
    location: dbLocation,
    registrations: regs,
  });
}

// Helper function to update a Telegram message from database state
export async function updateTelegramMessageFromDatabase(
  chatId: number,
  messageId: number
): Promise<{
  success: boolean;
  removed?: boolean;
  error?: string;
  error_code?: number;
}> {
  try {
    const { data: telegramMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("booking_id")
      .eq("message_id", messageId)
      .eq("chat_id", chatId)
      .single();

    if (messageError || !telegramMessage) {
      return { success: false, error: "Message not found in database" };
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        locations:location_id (
          id,
          name,
          url
        )
      `
      )
      .eq("id", telegramMessage.booking_id)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Booking not found" };
    }

    const { data: registrations, error: regError } = await supabaseAdmin
      .from("registrations")
      .select(
        `
        id,
        users:user_id (
          id,
          username,
          first_name,
          skill_level
        )
      `
      )
      .eq("booking_id", booking.id)
      .order("created_at");

    if (regError) {
      return { success: false, error: "Failed to fetch registrations" };
    }

    const updatedMessage = await generateMessageFromDatabase(
      booking,
      registrations || []
    );

    const tgRes = await TelegramAPI.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: updatedMessage,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: booking.cancelled
        ? undefined
        : {
            inline_keyboard: [
              ...REGISTRATION_BUTTONS,
              [{ text: "Open Settings", url: "https://t.me/padel_dubai_bot?startapp" }],
            ],
          },
    });

    if (!tgRes?.ok) {
      const desc = String(tgRes?.description || "").toLowerCase();
      const code = tgRes?.error_code;
      const notModified = /message is not modified/.test(desc);
      const notFound = /message to edit not found/.test(desc);
      const rateLimited = code === 429 || /too many requests/.test(desc);

      // Treat "not modified" as a successful no-op
      if (notModified) {
        return { success: true };
      }

      // Only delete DB record when Telegram says the message does not exist
      if (notFound && !rateLimited) {
        try {
          await supabaseAdmin
            .from("messages")
            .delete()
            .match({ chat_id: chatId, message_id: messageId });
        } catch (e) {
          console.error("Error deleting message from database:", e);
          // ignore delete errors; we'll still report removed intent
        }
        return { success: true, removed: true };
      }

      return {
        success: false,
        error: tgRes?.description || "Telegram editMessageText failed",
        error_code: tgRes?.error_code,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating telegram message from database:", error);
    return { success: false, error: "Failed to update message" };
  }
}
