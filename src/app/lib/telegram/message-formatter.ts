// Message formatting utilities - converts data to display messages

import { GameInfo } from "./types";
import { GameDataManager } from "./game-data";

// Helper function to format Date objects back to display strings
function formatGameDateTime(
  startTime: Date,
  endTime: Date
): { day: string; date: string; time: string; title: string } {
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
  const endTimeStr = `${endTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;
  const time = `${startTimeStr}-${endTimeStr}`;

  const title = `${day}, ${date}, ${time}`;

  return { day, date, time, title };
}

export class MessageFormatter {
  /**
   * Formats a game message from GameInfo data
   */
  static formatGameMessage(gameInfo: GameInfo): string {
    const locationLink = gameInfo.location.mapsUrl
      ? `<a href="${gameInfo.location.mapsUrl}">${gameInfo.location.name}</a>`
      : gameInfo.location.name;

    const calendarSection = gameInfo.calendarLink
      ? `📅 <a href="${gameInfo.calendarLink}">Добавить в Google Calendar</a>`
      : "📅 Добавить в Google Calendar";

    // Format registered players
    const playerSlots = this.formatPlayerSlots(gameInfo);
    const waitlistSection = this.formatWaitlist(gameInfo);

    // Generate title from Date objects
    const { title } = formatGameDateTime(gameInfo.startTime, gameInfo.endTime);

    let message = `🎾 <b>${title}</b>

📍 <b>Место:</b> ${locationLink}
💵 <b>Цена:</b> ${gameInfo.price}
🏟️ <b>Забронировано кортов:</b> ${gameInfo.courts}`;

    if (gameInfo.note) {
      message += `\n\n${gameInfo.note}`;
    }

    if (gameInfo.cancelled) {
      message += "\n\n❗️<b>ОТМЕНА</b>❗️";
    }

    message += `\n\n${calendarSection}

${
  gameInfo.cancelled
    ? "<b>Игра отменена. Waitlist:</b>"
    : "<b>Записавшиеся игроки:</b>"
}
${playerSlots}

${waitlistSection}`;

    return message;
  }

  /**
   * Formats the player slots section
   */
  private static formatPlayerSlots(gameInfo: GameInfo): string {
    const slots: string[] = [];

    // Fill slots with registered players
    for (let i = 0; i < gameInfo.maxPlayers; i++) {
      const player = gameInfo.registeredPlayers[i];
      if (player) {
        slots.push(`${i + 1}. ${player.userName} (${player.skillLevel})`);
      } else {
        slots.push(`${i + 1}. -`);
      }
    }

    return slots.join("\n");
  }

  /**
   * Formats the waitlist section
   */
  private static formatWaitlist(gameInfo: GameInfo): string {
    if (gameInfo.waitlist.length === 0) {
      return "⏳ <b>Waitlist:</b>\n---";
    }

    const waitlistPlayers = gameInfo.waitlist
      .map(
        (player, index) =>
          `${index + 1}. ${player.userName} (${player.skillLevel})`
      )
      .join("\n");

    return `⏳ <b>Waitlist:</b>\n${waitlistPlayers}`;
  }

  /**
   * Formats an admin control message for private admin chats
   */
  static formatAdminControlMessage(gameInfo: GameInfo): string {
    const stats = GameDataManager.getGameStats(gameInfo);

    const statusIcon = gameInfo.cancelled ? "🚫" : "✅";
    const statusText = gameInfo.cancelled ? "ОТМЕНЕНА" : "АКТИВНА";

    return `🔧 <b>Панель администратора</b>

${statusIcon} <b>Игра:</b> ${gameInfo.title}
📊 <b>Статус:</b> ${statusText}

📍 <b>Место:</b> ${gameInfo.location.name}
💵 <b>Цена:</b> ${gameInfo.price}
🏟️ <b>Кортов:</b> ${gameInfo.courts}

📈 <b>Статистика:</b>
👥 Записано: ${stats.registeredCount}/${gameInfo.maxPlayers}
⏳ В waitlist: ${stats.waitlistCount}
📊 Всего участников: ${stats.totalParticipants}

🔗 <b>Ссылка на игру:</b>
Chat ID: ${gameInfo.chatId}
Message ID: ${gameInfo.messageId}

⏰ <b>Последнее обновление:</b> ${gameInfo.updatedAt.toLocaleString("ru-RU", {
      timeZone: "Asia/Dubai",
    })}`;
  }

  /**
   * Formats a welcome message for new group members
   */
  static formatWelcomeMessage(firstName: string): string {
    return `Привет ${firstName} 🎾!
Добро пожаловать в наш padel чат!
У нас дружелюбная команда, и мы всегда рады новым участникам

🏓 Немного о нас:
— Играем несколько раз в неделю в лучших клубах Дубая
— Атмосфера — лёгкая, без негатива, играем с удовольствием
— Отношение друг к другу — уважительное и поддерживающее
— Есть разные уровни игры, чтобы всем было комфортно и интересно

🎯 Перед первой игрой, пожалуйста, ознакомься с нашими правилами — там описаны формат, требования и как всё устроено:
<a href="https://t.me/PadDXB/602">Ссылка на правила</a>

🤝 Если ты не уверен, подходит ли тебе уровень — ничего страшного, просто напиши администратору, мы всегда подскажем и поможем.

💬 Если есть вопросы — не стесняйся писать в чат или в личку. Мы всегда на связи!

До встречи на корте! 🏆`;
  }

  /**
   * Formats the weekly schedule header message
   */
  static formatWeeklyScheduleMessage(weekRange: string): string {
    return `🏓 <b>Расписание Padel на следующую неделю</b> 🏓

Друзья, привет! ❗️

Выберите подходящие вам игры и укажите ваш уровень! 🎾

📅 Неделя: ${weekRange}`;
  }

  /**
   * Formats a cancelled game message
   */
  static formatCancelledGameMessage(gameInfo: GameInfo): string {
    const cancelledGame = GameDataManager.cancelGame(gameInfo);
    return this.formatGameMessage(cancelledGame);
  }

  /**
   * Formats a restored game message
   */
  static formatRestoredGameMessage(gameInfo: GameInfo): string {
    const restoredGame = GameDataManager.restoreGame(gameInfo);
    // Clear all registrations when restoring
    restoredGame.registeredPlayers = [];
    restoredGame.waitlist = [];
    return this.formatGameMessage(restoredGame);
  }

  /**
   * Gets current Dubai time as a formatted string
   */
  static getCurrentDubaiTime(): string {
    return new Date().toLocaleString("ru-RU", {
      timeZone: "Asia/Dubai",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  /**
   * Gets current week date range
   */
  static getCurrentWeekDateRange(): string {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate days until next Monday
    const daysUntilNextMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7;

    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilNextMonday);

    const sunday = new Date(nextMonday);
    sunday.setDate(nextMonday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Dubai",
      });
    };

    return `${formatDate(nextMonday)} - ${formatDate(sunday)}`;
  }
}
