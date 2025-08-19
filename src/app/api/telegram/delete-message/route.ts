import { NextRequest, NextResponse } from "next/server";
import { TelegramAPI } from "@lib/telegram/api";
import { validateAdminUser } from "@lib/supabase/auth";
import { supabaseAdmin } from "@lib/supabase/admin";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminUser(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { messageId, chatId } = await request.json();

    if (!messageId || !chatId) {
      return NextResponse.json(
        { error: "messageId and chatId are required" },
        { status: 400 }
      );
    }

    // Delete message from Telegram
    const response = await TelegramAPI.deleteMessage({
      chat_id: chatId,
      message_id: messageId,
    });

    if (!response.ok) {
      console.error("Failed to delete Telegram message:", response);
      return NextResponse.json(
        { error: response.description || "Failed to delete message from Telegram" },
        { status: 400 }
      );
    }

    // Delete message from database
    const { error: deleteError } = await supabaseAdmin
      .from("messages")
      .delete()
      .eq("message_id", messageId)
      .eq("chat_id", chatId);

    if (deleteError) {
      console.error("Failed to delete message from database:", deleteError);
      // Don't fail the response since the Telegram message was deleted successfully
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}