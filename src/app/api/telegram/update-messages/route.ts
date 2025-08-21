import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { updateTelegramMessageFromDatabase } from "@/app/lib/telegram/booking";

export const runtime = "edge";

interface UpdateMessagesRequest {
  bookingId?: number;
  chatId?: number;
  messageId?: number;
  userId?: number; // reserved for future expansion
}

export async function POST(request: Request) {
  try {
    const { bookingId, chatId, messageId }: UpdateMessagesRequest =
      await request.json();

    // If explicit chat/message provided, update that single message
    if (chatId && messageId) {
      const result = await updateTelegramMessageFromDatabase(chatId, messageId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to update message" },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, processed: 1, failed: 0 });
    }

    // Otherwise, require bookingId to update all messages for that booking
    if (!bookingId) {
      return NextResponse.json(
        { error: "Provide bookingId or chatId+messageId" },
        { status: 400 }
      );
    }

    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select("chat_id, message_id")
      .eq("booking_id", bookingId);

    if (error) {
      console.error("Failed to fetch messages for booking:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    const updates = (messages || []).map((m) =>
      updateTelegramMessageFromDatabase(m.chat_id, m.message_id)
    );
    const results = await Promise.allSettled(updates);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.warn(
        `Some Telegram message updates failed (${failed.length}/${results.length})`
      );
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      failed: failed.length,
    });
  } catch (error) {
    console.error("Error updating telegram messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
