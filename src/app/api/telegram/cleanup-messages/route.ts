import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export const runtime = "edge";

/**
 * Admin endpoint to check and cleanup messages that have been deleted from Telegram
 * This endpoint verifies if messages still exist in Telegram by attempting to edit their reply markup
 * If the edit fails due to "message not found", the message is marked as inactive in our database
 */
export async function POST() {
  try {
    // Get all active messages from database
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from("messages")
      .select("id, message_id, chat_id")
      .eq("is_active", true);

    if (messagesError) {
      console.error("Failed to fetch messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active messages to check",
        checked: 0,
        cleaned: 0,
      });
    }

    let checkedCount = 0;
    let cleanedCount = 0;

    // Check each message to see if it still exists in Telegram
    for (const message of messages) {
      try {
        checkedCount++;
        
        // Try to edit the message to check if it still exists
        // We'll make a minimal edit that doesn't actually change anything
        const response = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: message.chat_id,
              message_id: message.message_id,
              reply_markup: {}, // Empty markup - this won't visually change anything
            }),
          }
        );

        const result = await response.json();

        // If message doesn't exist, API will return error
        if (!result.ok && (result.error_code === 400 || result.description?.includes("message to edit not found"))) {
          const { error: updateError } = await supabaseAdmin
            .from("messages")
            .update({ is_active: false })
            .eq("id", message.id);

          if (updateError) {
            console.error(
              `Failed to mark message ${message.message_id} as inactive:`,
              updateError
            );
          } else {
            cleanedCount++;
            console.log(
              `Message ${message.message_id} marked as inactive (deleted from Telegram)`
            );
          }
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `Error checking message ${message.message_id}:`,
          error
        );
        // Continue with other messages even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Checked ${checkedCount} messages, cleaned ${cleanedCount} deleted messages.`,
      checked: checkedCount,
      cleaned: cleanedCount,
    });
  } catch (error) {
    console.error("Error in message cleanup:", error);
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