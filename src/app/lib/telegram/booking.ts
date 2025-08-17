import { AdminUtils, GameDataManager, MessageFormatter, TelegramAPI } from "@/app/lib/telegram";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

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
      .eq("is_active", true)
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
      action === "leave"
        ? `${cleanUserName} отменил участие`
        : undefined;

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

export async function generateMessageFromDatabase(
  booking: BookingWithLocation,
  registrations: RegistrationWithUser[]
): Promise<string> {
  const location = booking.locations;
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);

  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const day = days[startTime.getDay()];
  const date = `${startTime.getDate().toString().padStart(2, "0")}.${(
    startTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const startTimeStr = `${startTime.getHours()}:${startTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const endTimeStr = `${endTime.getHours()}:${endTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const time = `${startTimeStr}-${endTimeStr}`;

  const players = registrations.map((reg) => ({
    id: reg.users.id,
    userName: reg.users.username ? `@${reg.users.username}` : reg.users.first_name,
    skillLevel: reg.users.skill_level || "E",
    registrationTime: new Date(),
  }));

  const gameInfo = GameDataManager.createGameInfo({
    day,
    date,
    time,
    club: location.name,
    price: `${booking.price} aed/чел`,
    courts: booking.courts,
    note: booking.note || undefined,
    chatId: parseInt(process.env.CHAT_ID!),
  });

  gameInfo.location = { name: location.name, mapsUrl: location.url || "" };
  gameInfo.startTime = startTime;
  gameInfo.endTime = endTime;
  gameInfo.registeredPlayers = players.slice(0, 4);
  gameInfo.waitlist = players.slice(4);
  if (booking.cancelled) gameInfo.cancelled = true;

  return MessageFormatter.formatGameMessage(gameInfo);
}

// Helper function to update a Telegram message from database state
export async function updateTelegramMessageFromDatabase(
  chatId: number,
  messageId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: telegramMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("booking_id")
      .eq("message_id", messageId)
      .eq("chat_id", chatId)
      .eq("is_active", true)
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

    await TelegramAPI.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: updatedMessage,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: booking.cancelled
        ? undefined
        : {
            inline_keyboard: AdminUtils.getButtonsForUser(),
          },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating telegram message from database:", error);
    return { success: false, error: "Failed to update message" };
  }
}

