import { NextResponse } from "next/server";
import {
  TelegramAPI,
  REGISTRATION_BUTTONS,
  MessageFormatter,
} from "@/app/lib/telegram";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Booking, Location, User } from "../../../../../database.types";

export const runtime = "edge";

interface PostBookingRequest {
  bookingId: number;
}

export async function POST(request: Request) {
  try {
    const { bookingId }: PostBookingRequest = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Fetch booking data from database
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking already has an active Telegram message
    const { data: existingMessage, error: messageCheckError } =
      await supabaseAdmin
        .from("messages")
        .select("id")
        .eq("booking_id", bookingId)
        .eq("is_active", true)
        .single();

    if (!messageCheckError && existingMessage) {
      return NextResponse.json(
        { error: "Booking already posted to Telegram" },
        { status: 400 }
      );
    }

    // Fetch location data
    const { data: location, error: locationError } = await supabaseAdmin
      .from("locations")
      .select("*")
      .eq("id", booking.location_id)
      .single();

    if (locationError || !location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    // Convert booking data to display
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const chatId = parseInt(process.env.CHAT_ID!);

    // Format dates for display
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

    // Prepare DB-typed values
    const dbBooking = booking as Booking;
    const dbLocation = location as Location;

    // Fetch registrations with user info to show players/waitlist
    type RegistrationWithUser = {
      id: number;
      users: Pick<User, "id" | "username" | "first_name" | "skill_level">;
    };
    const { data: registrations } = await supabaseAdmin
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

    const regs = ((registrations as RegistrationWithUser[] | null) || []).map(
      (r) => ({
        user: r.users,
      })
    );

    // Format the message directly from DB types
    const gameMessage = MessageFormatter.formatBookingMessage({
      booking: dbBooking,
      location: dbLocation,
      registrations: regs,
    });

    // Send message to Telegram
    const gameResult = await TelegramAPI.sendMessage({
      chat_id: process.env.CHAT_ID!,
      text: gameMessage,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: booking.cancelled
        ? undefined
        : {
            inline_keyboard: REGISTRATION_BUTTONS,
          },
    });

    if (!gameResult.ok) {
      console.error("Failed to send game message:", gameResult);
      return NextResponse.json(
        { error: "Failed to send message to Telegram" },
        { status: 500 }
      );
    }

    const messageId = gameResult.result?.message_id;
    if (!messageId) {
      return NextResponse.json(
        { error: "No message ID returned from Telegram" },
        { status: 500 }
      );
    }

    // Store telegram message in the new table
    const { error: insertMessageError } = await supabaseAdmin
      .from("messages")
      .insert({
        booking_id: bookingId,
        message_id: messageId,
        chat_id: chatId,
        is_active: true,
      });

    if (insertMessageError) {
      console.error("Failed to store telegram message:", insertMessageError);
      // Message was sent successfully, but we couldn't store it in database
      // This is not a critical error, so we'll still return success
    }

    // Admin controls are now handled through the Telegram Mini App
    // No need to send private admin control messages

    console.log(
      `Booking ${bookingId} posted to Telegram with message ID ${messageId}`
    );

    return NextResponse.json({
      success: true,
      message_id: messageId,
      booking_id: bookingId,
      game_info: {
        title: `${day}, ${date}, ${time}`,
        location: location.name,
        time: `${day}, ${date}, ${time}`,
        cancelled: booking.cancelled,
      },
    });
  } catch (error) {
    console.error("Error posting booking to Telegram:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
