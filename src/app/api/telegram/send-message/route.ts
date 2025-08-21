import { NextRequest, NextResponse } from "next/server";
import { TelegramAPI } from "@lib/telegram/api";
import { validateAdminUser } from "@lib/supabase/auth";
import { supabaseAdmin } from "@lib/supabase/admin";

export const runtime = "edge";

interface SendMessageRequest {
  text: string;
  chatId: string | number; // Chat ID for sending message
  parseMode?: string;
  replyMarkup?: {
    inline_keyboard: ReadonlyArray<
      ReadonlyArray<{ readonly text: string; readonly callback_data: string }>
    >;
  };
  bookingId?: number; // Optional booking ID to store the message relation
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

    const {
      text,
      chatId,
      parseMode,
      replyMarkup,
      bookingId,
    }: SendMessageRequest = await request.json();

    if (!text || !chatId) {
      return NextResponse.json(
        { error: "text and chatId are required" },
        { status: 400 }
      );
    }

    // Send message to Telegram
    const response = await TelegramAPI.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: parseMode || "HTML",
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    });

    if (!response.ok) {
      console.error("Failed to send Telegram message:", {
        status: response.ok,
        description: response.description,
        error_code: response.error_code,
        chatId: chatId,
        originalChatId: chatId,
        textLength: text.length,
        fullResponse: response,
      });
      return NextResponse.json(
        { error: response.description || "Failed to send message to Telegram" },
        { status: 400 }
      );
    }

    const messageId = response.result?.message_id;
    if (!messageId) {
      return NextResponse.json(
        { error: "No message ID returned from Telegram" },
        { status: 500 }
      );
    }

    // Store message in database if bookingId is provided
    if (bookingId) {
      const { error: insertError } = await supabaseAdmin
        .from("messages")
        .insert({
          booking_id: bookingId,
          message_id: messageId,
          chat_id: parseInt(String(chatId)),
        });

      if (insertError) {
        console.error("Failed to store message in database:", insertError);
        // Don't fail the response since the message was sent successfully
      }
    }

    return NextResponse.json({
      success: true,
      messageId,
      chatId: chatId,
    });
  } catch (error) {
    console.error("Send message error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
