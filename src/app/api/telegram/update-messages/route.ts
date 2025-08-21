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
    let payload: UpdateMessagesRequest = {};
    try {
      payload = await request.json();
    } catch {
      // allow empty body for full scan mode
      payload = {};
    }
    const { bookingId, chatId, messageId } = payload;

    // If explicit chat/message provided, update that single message
    if (chatId && messageId) {
      const result = await updateTelegramMessageFromDatabase(chatId, messageId);
      if (result.success) {
        return NextResponse.json({ success: true, processed: 1, failed: 0, removed: result.removed ? 1 : 0 });
      }
      return NextResponse.json(
        { error: result.error || "Failed to update message" },
        { status: 500 }
      );
    }

    // If no filters provided, perform a full scan like cleanup-messages
    if (!bookingId && !chatId && !messageId) {
      const { data: allMessages, error: messagesError } = await supabaseAdmin
        .from("messages")
        .select("id, chat_id, message_id");

      if (messagesError) {
        console.error("Failed to fetch messages:", messagesError);
        return NextResponse.json(
          { error: "Failed to fetch messages" },
          { status: 500 }
        );
      }

      let checked = 0;
      let cleaned = 0;
      let failed = 0;
      for (const m of allMessages || []) {
        const res = await updateTelegramMessageFromDatabase(m.chat_id, m.message_id);
        checked++;
        if (res.success && res.removed) cleaned++;
        else if (!res.success) failed++;
        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 100));
      }

      return NextResponse.json({ success: true, checked, cleaned, failed });
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

    let processed = 0;
    let failed = 0;
    let removed = 0;
    for (const m of messages || []) {
      const res = await updateTelegramMessageFromDatabase(m.chat_id, m.message_id);
      processed++;
      if (res.success && res.removed) removed++;
      else if (!res.success) failed++;
      // small delay to avoid rate limiting when multiple failures
      if (!res.success || res.removed) await new Promise((r) => setTimeout(r, 100));
    }

    return NextResponse.json({ success: true, processed, failed, removed });
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
