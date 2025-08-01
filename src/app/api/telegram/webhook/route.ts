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
  type AdminAction,
  // MessageUtils removed - using new data-first architecture
} from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";

export async function POST(req: NextRequest) {
  const update = await req.json();
  const callbackQuery = update.callback_query;

  // Handle admin-only callbacks
  if (callbackQuery && callbackQuery.data?.startsWith("admin_")) {
    const adminAction = callbackQuery.data.replace("admin_", "") as AdminAction;
    const user = callbackQuery.from;

    // Check if user is admin
    if (!AdminUtils.isAdmin(user.id)) {
      try {
        await TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: CALLBACK_MESSAGES.ADMIN_UNAUTHORIZED,
          show_alert: true,
        });
        return NextResponse.json({ ok: true });
      } catch (error) {
        console.error("Error sending admin unauthorized message:", error);
        return NextResponse.json({ ok: true });
      }
    }

    // Handle admin actions from private messages
    const currentText = callbackQuery.message.text;
    let responseText = "";

    try {
      // Extract admin control data from the message
      const adminControlData =
        GameDataManager.extractAdminControlDataFromMessage(currentText);

      if (!adminControlData) {
        await TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: "❌ Не удалось найти данные об игре.",
          show_alert: true,
        });
        return NextResponse.json({ ok: true });
      }

      const { chatId, messageId } = adminControlData;

      // Since we can't embed full game data, we need to get the current message to parse it
      // For now, we'll use a simplified approach for admin actions
      switch (adminAction) {
        case "cancel_game":
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_CANCELLED;

          try {
            // We'll need to fetch the current message to get the game data
            // For now, let's use a basic cancellation approach
            const basicCancelledMessage = `🚫 <b>Игра отменена администратором</b>

❌ Регистрация на эту игру закрыта

🚫 <b>Игра отменена</b>`;

            await TelegramAPI.editMessageText({
              chat_id: chatId,
              message_id: messageId,
              text: basicCancelledMessage,
              parse_mode: "HTML",
              disable_web_page_preview: true,
              // No reply_markup = no buttons
            });

            // Send notification
            await TelegramAPI.sendMessage({
              chat_id: chatId,
              text: "🚫 <b>Игра отменена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: messageId,
            });
          } catch (error) {
            console.error("Error cancelling game:", error);
            // Fallback: just send notification
            await TelegramAPI.sendMessage({
              chat_id: chatId,
              text: "🚫 <b>Игра отменена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: messageId,
            });
          }
          break;

        case "restore_game":
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_RESTORED;

          try {
            // Basic restoration - this would need to be enhanced to preserve original game info
            const basicRestoredMessage = `✅ <b>Игра восстановлена администратором</b>

🎾 Регистрация на игру снова открыта

<b>Записавшиеся игроки:</b>
1. -
2. -
3. -
4. -

⏳ <b>Waitlist:</b>
---`;

            await TelegramAPI.editMessageText({
              chat_id: chatId,
              message_id: messageId,
              text: basicRestoredMessage,
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: AdminUtils.getButtonsForUser(),
              },
            });

            // Send notification
            await TelegramAPI.sendMessage({
              chat_id: chatId,
              text: "✅ <b>Игра восстановлена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: messageId,
            });
          } catch (error) {
            console.error("Error restoring game:", error);
            // Fallback: just send notification
            await TelegramAPI.sendMessage({
              chat_id: chatId,
              text: "✅ <b>Игра восстановлена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: messageId,
            });
          }
          break;

        case "game_stats":
          // For stats, we'd need to fetch the actual game message
          // For now, show a generic message
          responseText =
            "📊 Для получения актуальной статистики проверьте сообщение игры";

          await TelegramAPI.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: responseText,
            show_alert: true,
          });
          return NextResponse.json({ ok: true });

        default:
          responseText = "❌ Неизвестная административная команда.";
      }

      // Send response to admin
      await TelegramAPI.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: responseText,
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error handling admin callback:", error);
      return NextResponse.json({ ok: true });
    }
  }

  // Handle button callbacks for skill level selection
  if (callbackQuery && callbackQuery.data?.startsWith("skill_")) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const selectedLevel = callbackQuery.data.replace(
      "skill_",
      ""
    ) as PlayerAction;
    const user = callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

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
        selectedLevel === "not_coming" ||
        gameInfo.registeredPlayers.some((p) => p.id === user.id) ||
        gameInfo.waitlist.some((p) => p.id === user.id);

      if (isCancellation && selectedLevel === "not_coming") {
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

      // Update game state with user action
      const { updatedGame, notification } =
        GameDataManager.updateGameWithUserAction(
          gameInfo,
          { id: user.id, userName: displayName },
          selectedLevel
        );

      // Format the updated message
      const updatedMessage = MessageFormatter.formatGameMessage(updatedGame);

      // Run answerCallbackQuery and editMessageText concurrently
      const promises = [
        TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text:
            selectedLevel === "not_coming"
              ? CALLBACK_MESSAGES.NOT_COMING
              : CALLBACK_MESSAGES.REGISTERED(selectedLevel),
        }),
        TelegramAPI.editMessageText({
          chat_id: chatId,
          message_id: messageId,
          text: updatedMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: AdminUtils.getButtonsForUser(),
          },
        }),
      ];

      // If there's a notification, send it as a separate message
      if (notification) {
        promises.push(
          TelegramAPI.sendMessage({
            chat_id: chatId,
            text: notification,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          })
        );
      }

      await Promise.all(promises);
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
