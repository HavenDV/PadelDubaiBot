import { NextRequest, NextResponse } from "next/server";
import { TelegramAPI } from "@lib/telegram/api";
import { validateAdminUser } from "@lib/supabase/auth";
import { supabaseAdmin } from "@lib/supabase/admin";

export const runtime = "edge";

interface UnpinMessageBody {
  messageId?: number; // optional, but we will pass specific
  chatId: number | string;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminUser(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { messageId, chatId }: UnpinMessageBody = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const response = await TelegramAPI.unpinChatMessage({
      chat_id: chatId,
      message_id: messageId,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.description || "Failed to unpin message" },
        { status: 400 }
      );
    }

    // Update DB pin state (best-effort)
    try {
      if (messageId) {
        await supabaseAdmin
          .from("messages")
          .update({ is_pinned: false, pinned_at: null })
          .eq("chat_id", chatId)
          .eq("message_id", messageId);
      }
      await supabaseAdmin
        .from("chats")
        .update({ pinned_message_id: null })
        .eq("id", chatId);
    } catch (e) {
      console.error("Failed to update unpin state in DB:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unpin message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
