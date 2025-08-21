import { Bot, Context } from "grammy";
import type { InlineKeyboardMarkup, Chat, ChatFullInfo } from "grammy/types";
import {
  CALLBACK_MESSAGES,
  MessageFormatter,
  REGISTRATION_BUTTONS,
} from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";
import {
  handleDatabaseRegistration,
  isLateCancellationByMessage,
} from "@/app/lib/telegram/booking";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { ChatInsert } from "../../../../database.types";

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new Bot<Context>(token);

// Ensure bot.init() is called exactly once per runtime
let botInitialized = false;
let botInitPromise: Promise<void> | null = null;
export async function ensureBotInit() {
  if (botInitialized) return;
  if (!botInitPromise) {
    botInitPromise = bot
      .init()
      .then(() => {
        botInitialized = true;
      })
      .catch((err) => {
        // Reset promise on failure so future attempts can retry
        botInitPromise = null;
        throw err;
      });
  }
  await botInitPromise;
}

// Callback buttons: join/leave and legacy skill_* buttons
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data || "";
  const msg = ctx.callbackQuery.message;
  if (!msg) return;

  if (data === "join_game" || data === "leave_game") {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const action: "join" | "leave" = data === "join_game" ? "join" : "leave";

    const user = ctx.callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    // Early ack
    try {
      await ctx.answerCallbackQuery({
        text:
          action === "leave"
            ? CALLBACK_MESSAGES.NOT_COMING
            : "Записываем вас на игру...",
      });
    } catch {}

    // Late cancellation warning (only for leave) - DB-based
    // Show an alert but proceed to process the leave to free the slot
    if (action === "leave") {
      const lc = await isLateCancellationByMessage(chatId, messageId);
      if (lc.isLate && lc.hoursRemaining !== null) {
        try {
          await ctx.answerCallbackQuery({
            text: CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(
              lc.hoursRemaining
            ),
            show_alert: true,
          });
        } catch {}
        // Do not return here; continue to remove registration
      }
    }
    try {
      const dbResult = await handleDatabaseRegistration(
        messageId,
        user.id,
        displayName,
        action,
        chatId
      );

      if (!dbResult.success) {
        if (dbResult.error) {
          await ctx.answerCallbackQuery({
            text: dbResult.error,
            show_alert: true,
          });
        }
        return;
      }

      if (dbResult.updatedMessage) {
        const replyMarkup: InlineKeyboardMarkup = {
          inline_keyboard: [
            ...REGISTRATION_BUTTONS.map((row) =>
              row.map((b) => ({ text: b.text, callback_data: b.callback_data }))
            ),
            [{ text: "Open Settings", url: "https://t.me/padel_dubai_bot?startapp" }],
          ],
        };
        await ctx.api.editMessageText(
          chatId,
          messageId,
          dbResult.updatedMessage,
          {
            parse_mode: "HTML",
            link_preview_options: { is_disabled: true },
            reply_markup: replyMarkup,
          }
        );
      }

      if (dbResult.notification) {
        await ctx.api.sendMessage(chatId, dbResult.notification, {
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        });
      }
    } catch (err) {
      console.error("grammY handler error:", err);
    }
  }
});

// Simple mention reply (preserves existing behavior)
bot.on("message", async (ctx) => {
  const msg = ctx.message;
  const text = msg?.text || "";
  const isDirectMention = text.includes("@padel_dubai_bot");
  const isReplyToBot =
    msg?.reply_to_message?.from?.username === "padel_dubai_bot" ||
    msg?.reply_to_message?.via_bot?.username === "padel_dubai_bot";

  if (!isDirectMention && !isReplyToBot) return;
  // Keep minimal echo to avoid coupling with OpenAI here
  try {
    if (msg?.pinned_message) return;
    const promptText =
      isReplyToBot && msg.reply_to_message?.text
        ? `Предыдущее сообщение: ${msg.reply_to_message.text}\nОтвет игрока: ${text}`
        : text;

    const joke = await OpenAIUtils.generateJoke(promptText);
    await ctx.api.sendMessage(msg.chat.id, joke, {
      reply_to_message_id: msg.message_id,
      link_preview_options: { is_disabled: true },
    });
  } catch {}
});

// Welcome new chat members
bot.on("message:new_chat_members", async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const newMembers = ctx.message?.new_chat_members;
    if (!chatId || !newMembers?.length) return;

    for (const member of newMembers) {
      if (member.is_bot) continue;
      const firstName = member.first_name || "друг";
      const welcome = MessageFormatter.formatWelcomeMessage(firstName);
      await ctx.api.sendMessage(chatId, welcome, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      });
    }
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
});

// Track when the bot is added to or removed from chats (preferred event)
bot.on("my_chat_member", async (ctx) => {
  try {
    const mcm = ctx.update.my_chat_member;
    if (!mcm) return;

    const chat: Chat = mcm.chat;
    const status: string | undefined = mcm.new_chat_member?.status;

    const isJoin = ["member", "administrator", "restricted"].includes(
      String(status)
    );
    const isLeave = ["left", "kicked"].includes(String(status));

    if (isJoin) {
      // Fetch comprehensive chat data when joining
      await fetchAndStoreFullChatInfo(chat.id);
    } else if (isLeave) {
      const { error } = await supabaseAdmin
        .from("chats")
        .delete()
        .eq("id", chat.id);
      if (error) {
        console.error("Failed to delete chat on my_chat_member leave:", error);
      } else {
        console.log("Deleted chat on my_chat_member leave:", chat.id);
      }
    }
  } catch (e) {
    console.error("Error processing my_chat_member:", e);
  }
});

// Some setups deliver bot membership changes via chat_member
bot.on("chat_member", async (ctx) => {
  try {
    const cm = ctx.update.chat_member;
    if (!cm) return;

    const botIdStr = (process.env.TELEGRAM_BOT_TOKEN || "").split(":")[0];
    const botId = botIdStr ? parseInt(botIdStr, 10) : NaN;
    const memberUserId: number | undefined = cm.new_chat_member?.user?.id;
    if (!botId || memberUserId !== botId) return;

    const chat: Chat = cm.chat;
    const status: string | undefined = cm.new_chat_member?.status;
    const isJoin = ["member", "administrator", "restricted"].includes(
      String(status)
    );
    const isLeave = ["left", "kicked"].includes(String(status));

    if (isJoin) {
      // Fetch comprehensive chat data when joining
      await fetchAndStoreFullChatInfo(chat.id);
    } else if (isLeave) {
      const { error } = await supabaseAdmin
        .from("chats")
        .delete()
        .eq("id", chat.id);
      if (error) {
        console.error("Failed to delete chat on chat_member leave:", error);
      } else {
        console.log("Deleted chat on chat_member leave:", chat.id);
      }
    }
  } catch (e) {
    console.error("Error processing chat_member:", e);
  }
});

// Helper function to fetch and store comprehensive chat information using getChat API
export async function fetchAndStoreFullChatInfo(chatId: number): Promise<void> {
  try {
    const chatInfo: ChatFullInfo = await bot.api.getChat(chatId);

    // Create comprehensive record with ChatFullInfo data
    const fullChatRecord: ChatInsert = {
      // Core required fields
      id: chatInfo.id,
      type: chatInfo.type,

      // Basic chat information from ChatFullInfo
      title: chatInfo.title ?? undefined,
      username: chatInfo.username ?? undefined,
      description: chatInfo.description ?? undefined,
      bio: chatInfo.bio ?? undefined,

      // Get member count if available
      member_count: undefined,

      // Chat photo
      photo: JSON.stringify(chatInfo.photo) ?? undefined,

      // Permissions (available in groups/supergroups)
      permissions: JSON.stringify(chatInfo.permissions) ?? undefined,

      // Invite link
      invite_link: chatInfo.invite_link ?? undefined,

      // Pinned message
      pinned_message_id: chatInfo.pinned_message?.message_id ?? undefined,
    };

    // Handle private chat specific fields
    if (chatInfo.type === "private") {
      const privateChat = chatInfo as ChatFullInfo.PrivateChat;
      fullChatRecord.first_name = privateChat.first_name ?? undefined;
      fullChatRecord.last_name = privateChat.last_name ?? undefined;
      if (fullChatRecord.first_name) {
        const composed = `${fullChatRecord.first_name} ${
          fullChatRecord.last_name ?? ""
        }`.trim();
        fullChatRecord.name = composed;
      }
    }

    // Handle group chat specific fields
    if (chatInfo.type === "group") {
      const groupChat = chatInfo as ChatFullInfo.GroupChat;
      fullChatRecord.name = groupChat.title ?? undefined;
    }

    // Handle channel chat specific fields
    if (chatInfo.type === "channel") {
      const channelChat = chatInfo as ChatFullInfo.ChannelChat;
      fullChatRecord.name = channelChat.title ?? undefined;
    }

    // Handle supergroup specific fields
    if (chatInfo.type === "supergroup") {
      const supergroupChat = chatInfo as ChatFullInfo.SupergroupChat;
      fullChatRecord.is_forum = supergroupChat.is_forum ?? undefined;
      fullChatRecord.slow_mode_delay =
        supergroupChat.slow_mode_delay ?? undefined;
      fullChatRecord.has_protected_content =
        supergroupChat.has_protected_content ?? undefined;
      fullChatRecord.has_visible_history =
        supergroupChat.has_visible_history ?? undefined;
      fullChatRecord.has_aggressive_anti_spam_enabled =
        supergroupChat.has_aggressive_anti_spam_enabled ?? undefined;
      fullChatRecord.has_hidden_members =
        supergroupChat.has_hidden_members ?? undefined;
      fullChatRecord.sticker_set_name =
        supergroupChat.sticker_set_name ?? undefined;
      fullChatRecord.can_set_sticker_set =
        supergroupChat.can_set_sticker_set ?? undefined;
      fullChatRecord.linked_chat_id =
        supergroupChat.linked_chat_id ?? undefined;
      fullChatRecord.location =
        JSON.stringify(supergroupChat.location) ?? undefined;
    }

    const { error } = await supabaseAdmin
      .from("chats")
      .upsert(fullChatRecord, { onConflict: "id" });

    if (error) {
      console.error("Failed to store full chat info:", error);
    } else {
      console.log("Stored comprehensive chat info:", {
        id: fullChatRecord.id,
        type: fullChatRecord.type,
        title: fullChatRecord.title,
        hasDescription: !!fullChatRecord.description,
        hasMemberCount: !!fullChatRecord.member_count,
        hasPhoto: !!fullChatRecord.photo,
      });
    }
  } catch (error) {
    console.error("Failed to fetch chat info:", error);
    // Fallback: create basic record if getChat fails
    const basicRecord: ChatInsert = {
      id: chatId,
      type: "group", // Default fallback
    };

    await supabaseAdmin.from("chats").upsert(basicRecord, { onConflict: "id" });
  }
}
