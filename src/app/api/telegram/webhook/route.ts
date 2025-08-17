// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramAPI,
  AdminUtils,
  CALLBACK_MESSAGES,
  GameDataManager,
  MessageFormatter,
  type PlayerAction,
  // MessageUtils removed - using new data-first architecture
} from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

// Helper function to handle database-backed registrations
async function handleDatabaseRegistration(
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
    console.log(
      `Looking for message: messageId=${messageId}, chatId=${chatId}`
    );

    // Find booking through messages table
    const { data: telegramMessage, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("booking_id")
      .eq("message_id", messageId)
      .eq("chat_id", chatId)
      .eq("is_active", true)
      .single();

    console.log(
      `Database query result: found=${!!telegramMessage}, error=${
        messageError?.message
      }`
    );
    if (telegramMessage) {
      console.log(`Found booking_id: ${telegramMessage.booking_id}`);
    }

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
          username: userName.replace(/@|<a[^>]*>|<\/a>/g, "").trim(), // Clean HTML tags
          first_name: userName.replace(/@|<a[^>]*>|<\/a>/g, "").trim(),
          skill_level: "E", // Default skill level for new players
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
      console.error("Failed to fetch registrations:", regError);
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

// Helper function to generate message from database state
async function generateMessageFromDatabase(
  booking: BookingWithLocation,
  registrations: RegistrationWithUser[]
): Promise<string> {
  const location = booking.locations;
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);

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

  // Convert registrations to player format with skill levels
  const players = registrations.map((reg) => ({
    id: reg.users.id,
    userName: reg.users.username
      ? `@${reg.users.username}`
      : reg.users.first_name,
    skillLevel: reg.users.skill_level || "N/A", // Show skill level from profile
    registrationTime: new Date(), // Use current time as placeholder
  }));

  // Create GameInfo object
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

  // Set location with maps URL
  gameInfo.location = {
    name: location.name,
    mapsUrl: location.url || "",
  };

  // Set times
  gameInfo.startTime = startTime;
  gameInfo.endTime = endTime;

  // Set players (4 max, rest go to waitlist)
  gameInfo.registeredPlayers = players.slice(0, 4);
  gameInfo.waitlist = players.slice(4);

  // Check if cancelled
  if (booking.cancelled) {
    gameInfo.cancelled = true;
  }

  return MessageFormatter.formatGameMessage(gameInfo);
}

// Helper function to update a Telegram message from database state
// This can be called from webhook or from external Mini App updates
export async function updateTelegramMessageFromDatabase(
  chatId: number,
  messageId: number
): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: "Message not found in database" };
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

    // Get current registrations with skill levels
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

    // Generate updated message
    const updatedMessage = await generateMessageFromDatabase(
      booking,
      registrations || []
    );

    // Update Telegram message
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

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Not allowed" },
      { status: 405 }
    );
  }

  const update = await req.json();
  const timestamp = new Date().toISOString();
  const updateId = update.update_id;

  // Log every webhook message with full data for exploration
  console.log(`=== TELEGRAM WEBHOOK UPDATE [${timestamp}] ===`);
  console.log(`Update ID: ${updateId}`);
  console.log("Full update object:", JSON.stringify(update, null, 2));
  console.log(
    "Update type:",
    Object.keys(update).filter((key) => key !== "update_id")
  );

  // Log specific message types
  if (update.message) {
    console.log("MESSAGE received:");
    console.log("- Chat ID:", update.message.chat.id);
    console.log("- Message ID:", update.message.message_id);
    console.log("- From:", update.message.from);
    console.log("- Text:", update.message.text);
    console.log("- Date:", new Date(update.message.date * 1000).toISOString());
  }

  if (update.callback_query) {
    console.log("CALLBACK_QUERY received:");
    console.log("- Callback ID:", update.callback_query.id);
    console.log("- Data:", update.callback_query.data);
    console.log("- From:", update.callback_query.from);
    console.log("- Message Chat ID:", update.callback_query.message?.chat?.id);
    console.log("- Message ID:", update.callback_query.message?.message_id);
  }

  if (update.edited_message) {
    console.log("EDITED_MESSAGE received:");
    console.log("- Chat ID:", update.edited_message.chat.id);
    console.log("- Message ID:", update.edited_message.message_id);
    console.log(
      "- Edit date:",
      new Date(update.edited_message.edit_date * 1000).toISOString()
    );
  }

  if (update.channel_post) {
    console.log("CHANNEL_POST received:", update.channel_post);
  }

  if (update.inline_query) {
    console.log("INLINE_QUERY received:", update.inline_query);
  }

  if (update.chosen_inline_result) {
    console.log("CHOSEN_INLINE_RESULT received:", update.chosen_inline_result);
  }

  if (update.my_chat_member) {
    console.log("MY_CHAT_MEMBER received:", update.my_chat_member);
  }

  if (update.chat_member) {
    console.log("CHAT_MEMBER received:", update.chat_member);
  }

  if (update.chat_join_request) {
    console.log("CHAT_JOIN_REQUEST received:", update.chat_join_request);
  }

  if (update.poll) {
    console.log("POLL received:", update.poll);
  }

  if (update.poll_answer) {
    console.log("POLL_ANSWER received:", update.poll_answer);
  }

  console.log(`=== END WEBHOOK UPDATE ${updateId} ===\n`);

  const callbackQuery = update.callback_query;

  // Handle button callbacks for join/leave actions and legacy skill buttons
  if (callbackQuery && (callbackQuery.data === "join_game" || callbackQuery.data === "leave_game" || callbackQuery.data?.startsWith("skill_"))) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    
    // Handle both new and legacy button formats
    let action: "join" | "leave";
    if (callbackQuery.data === "join_game") {
      action = "join";
    } else if (callbackQuery.data === "leave_game") {
      action = "leave";
    } else if (callbackQuery.data?.startsWith("skill_")) {
      // Legacy skill button - convert to new format
      const skillLevel = callbackQuery.data.replace("skill_", "");
      action = skillLevel === "not_coming" ? "leave" : "join";
    } else {
      action = "leave"; // fallback
    }
    
    const user = callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    console.log(
      `Webhook received: chatId=${chatId}, messageId=${messageId}, user=${user.id}, action=${action}`
    );

    // Answer callback query immediately to prevent timeout
    try {
      await TelegramAPI.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: action === "leave" 
          ? CALLBACK_MESSAGES.NOT_COMING
          : "Записываем вас на игру...",
      });
      console.log("Callback query answered immediately");
    } catch (error) {
      console.error("Error answering callback query immediately:", error);
    }

    const currentText = callbackQuery.message.text;

    try {
      // Extract game data from the current message
      const gameInfo = GameDataManager.extractGameDataFromMessage(currentText);

      if (!gameInfo) {
        await TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: "❌ Не удалось загрузить данные об игре.",
          show_alert: true,
        });
        return NextResponse.json({ ok: true });
      }

      // Check for late cancellation penalty
      const isCancellation =
        action === "leave" ||
        gameInfo.registeredPlayers.some((p) => p.id === user.id) ||
        gameInfo.waitlist.some((p) => p.id === user.id);

      if (isCancellation && action === "leave") {
        const lateCancellationCheck =
          GameDataManager.isLateCancellation(gameInfo);

        if (
          lateCancellationCheck.isLate &&
          lateCancellationCheck.hoursRemaining !== null
        ) {
          // Send penalty warning instead of processing cancellation
          try {
            await TelegramAPI.answerCallbackQuery({
              callback_query_id: callbackQuery.id,
              text: CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(
                lateCancellationCheck.hoursRemaining
              ),
              show_alert: true, // Show as popup alert
            });
            return NextResponse.json({ ok: true });
          } catch (error) {
            console.error("Error sending penalty warning:", error);
            return NextResponse.json({ ok: true });
          }
        }
      }

      // Try database registration first (for new system)
      const dbResult = await handleDatabaseRegistration(
        messageId,
        user.id,
        displayName,
        action,
        chatId
      );

      let updatedMessage: string;
      let notification: string | undefined;

      if (dbResult.success && dbResult.updatedMessage) {
        // Use database-driven system
        updatedMessage = dbResult.updatedMessage;
        notification = dbResult.notification;
        console.log("Using database-driven registration system");
      } else if (dbResult.error) {
        // Handle specific errors like missing skill level
        try {
          await TelegramAPI.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: dbResult.error,
            show_alert: true,
          });
          return NextResponse.json({ ok: true });
        } catch (error) {
          console.error("Error sending error message:", error);
          return NextResponse.json({ ok: true });
        }
      } else {
        // Fallback to message-based system for backward compatibility
        console.warn(
          "Database registration failed, falling back to message parsing:",
          dbResult.error
        );

        // Convert action to legacy format for backward compatibility  
        const legacyAction: PlayerAction = action === "leave" ? "not_coming" : "D";
        
        // Update game state with user action (message-based system)
        const { updatedGame, notification: fallbackNotification } =
          GameDataManager.updateGameWithUserAction(
            gameInfo,
            { id: user.id, userName: displayName },
            legacyAction
          );

        // Format the updated message
        updatedMessage = MessageFormatter.formatGameMessage(updatedGame);
        notification = fallbackNotification;
      }

      console.log(
        `About to update Telegram message: chatId=${chatId}, messageId=${messageId}`
      );

      // Update the message
      try {
        await TelegramAPI.editMessageText({
          chat_id: chatId,
          message_id: messageId,
          text: updatedMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: AdminUtils.getButtonsForUser(),
          },
        });
        console.log("Message edited successfully");
      } catch (error) {
        console.error("Error editing message:", error);
      }

      // If there's a notification, send it as a separate message
      if (notification) {
        try {
          await TelegramAPI.sendMessage({
            chat_id: chatId,
            text: notification,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          });
          console.log("Notification sent successfully");
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error handling callback query:", error);
      // Still return success to Telegram to avoid retries
      return NextResponse.json({ ok: true });
    }
  }

  // Handle new chat members
  if (update.message?.new_chat_members?.length > 0) {
    try {
      const chatId = update.message.chat.id;
      const newMembers = update.message.new_chat_members;

      // Send welcome message to each new member
      for (const newMember of newMembers) {
        // Skip if the new member is a bot
        if (newMember.is_bot) {
          continue;
        }

        const firstName = newMember.first_name || "друг";
        const welcomeMessage = MessageFormatter.formatWelcomeMessage(firstName);

        await TelegramAPI.sendMessage({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error sending welcome message:", error);
      // Still return success to Telegram to avoid retries
      return NextResponse.json({ ok: true });
    }
  }

  // Handle regular messages mentioning the bot
  const msg = update.message;
  const isDirectMention = msg?.text?.includes("@padel_dubai_bot");
  const isReplyToBot =
    msg?.reply_to_message?.from?.username === "padel_dubai_bot" ||
    msg?.reply_to_message?.via_bot?.username === "padel_dubai_bot";

  // Do not reply to a pinned message
  if (msg?.pinned_message) {
    return NextResponse.json({ ok: true });
  }

  if (msg && (isDirectMention || isReplyToBot)) {
    try {
      const promptText =
        isReplyToBot && msg.reply_to_message?.text
          ? `Предыдущее сообщение: ${msg.reply_to_message.text}\nОтвет игрока: ${msg.text}`
          : msg.text ?? "";

      const joke = await OpenAIUtils.generateJoke(promptText);

      await TelegramAPI.sendMessage({
        chat_id: msg.chat.id,
        text: joke,
        reply_to_message_id: msg.message_id,
        disable_web_page_preview: true,
      });
    } catch (err) {
      console.error("OpenAI joke generation failed", err);
    }

    return NextResponse.json({ ok: true });
  }

  // Always ACK Telegram
  return NextResponse.json({ ok: true });
}
