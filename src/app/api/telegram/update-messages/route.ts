import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { updateTelegramMessageFromDatabase } from "@/app/lib/telegram/booking";

export const runtime = "edge";

interface UpdateMessagesRequest {
  userId?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const { userId }: UpdateMessagesRequest = body ? JSON.parse(body) : {};

    let query;
    
    if (userId) {
      // Find messages for bookings where specific user is registered
      query = supabaseAdmin
        .from("messages")
        .select(`
          message_id,
          chat_id,
          booking_id,
          bookings!inner (
            id,
            cancelled,
            registrations!inner (
              user_id
            )
          )
        `)
        .eq("bookings.cancelled", false)
        .eq("bookings.registrations.user_id", userId);
    } else {
      // Find all messages for active bookings
      query = supabaseAdmin
        .from("messages")
        .select(`
          message_id,
          chat_id,
          booking_id,
          bookings!inner (
            id,
            cancelled
          )
        `)
        .eq("bookings.cancelled", false);
    }

    const { data: messages, error: messagesError } = await query;

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { message: userId ? "No active messages found for user" : "No active messages found", updatedCount: 0 },
        { status: 200 }
      );
    }

    // Update all Telegram messages
    const updatePromises = messages.map(message =>
      updateTelegramMessageFromDatabase(message.chat_id, message.message_id)
    );

    const results = await Promise.allSettled(updatePromises);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      } else {
        errorCount++;
        const errorMsg = result.status === "rejected" 
          ? result.reason?.message || "Unknown error"
          : result.value.error || "Update failed";
        errors.push(`Message ${messages[index]?.message_id}: ${errorMsg}`);
      }
    });

    const response = {
      message: `Updated ${successCount} messages, ${errorCount} errors`,
      updatedCount: successCount,
      errorCount,
      errors: errorCount > 0 ? errors : undefined,
      filteredByUser: !!userId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}