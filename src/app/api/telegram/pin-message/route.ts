import { NextRequest, NextResponse } from "next/server";
import { TelegramAPI } from "@lib/telegram/api";
import { validateAdminUser } from "@lib/supabase/auth";
import { supabaseAdmin } from "@lib/supabase/admin";

export const runtime = "edge";

interface PinMessageBody {
  messageId: number;
  chatId: number | string;
  disableNotification?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Validate admin authentication
    const authResult = await validateAdminUser(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { messageId, chatId, disableNotification }: PinMessageBody =
      await request.json();

    if (!messageId || !chatId) {
      return NextResponse.json(
        { error: "messageId and chatId are required" },
        { status: 400 }
      );
    }

    const response = await TelegramAPI.pinChatMessage({
      chat_id: chatId,
      message_id: messageId,
      disable_notification: disableNotification ?? false,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.description || "Failed to pin message" },
        { status: 400 }
      );
    }

    // Mark message as pinned in DB (best-effort)
    try {
      await supabaseAdmin
        .from("messages")
        .update({ is_pinned: true, pinned_at: new Date().toISOString() })
        .eq("chat_id", chatId)
        .eq("message_id", messageId);
      // Update chat's pinned message pointer
      await supabaseAdmin
        .from("chats")
        .update({ pinned_message_id: messageId })
        .eq("id", chatId);
    } catch (e) {
      console.error("Failed to update pin state in DB:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pin message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
