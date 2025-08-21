// Message formatting utilities - converts DB data to Telegram messages
import { Booking, Location, User } from "../../../../database.types";
import { generateCalendarLinks } from "./constants";

// Helper function to format Date objects back to display strings
function formatGameDateTime(
  startTime: Date,
  endTime: Date
): { day: string; date: string; time: string; title: string } {
  // Format using Dubai timezone regardless of server/runtime timezone
  const timeZone = "Asia/Dubai" as const;

  // Weekday in Russian, capitalized (e.g., "Вторник")
  const weekday = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    timeZone,
  }).format(startTime);
  const day = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  // Date as DD.MM
  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
  }).format(startTime);

  // Times as HH:MM-HH:MM in Dubai time (24h)
  const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
  const startTimeStr = timeFormatter.format(startTime);
  const endTimeStr = timeFormatter.format(endTime);
  const time = `${startTimeStr}-${endTimeStr}`;

  const title = `${day}, ${date}, ${time}`;

  return { day, date, time, title };
}

export class MessageFormatter {
  /**
   * Formats a booking message directly from DB types
   */
  static formatBookingMessage(params: {
    booking: Booking;
    location: Location;
    registrations?: {
      user: Pick<User, "id" | "username" | "first_name" | "skill_level">;
    }[];
  }): string {
    const { booking, location } = params;

    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);

    const mapsUrl = location.url || undefined;
    const locationLink = mapsUrl
      ? `<a href="${mapsUrl}">${location.name}</a>`
      : location.name;

    const calendarLink = generateCalendarLinks({
      startTime,
      endTime,
      club: location.name,
    }).google;
    const calendarSection = calendarLink
      ? `📅 <a href="${calendarLink}">Добавить в Google Calendar</a>`
      : "📅 Добавить в Google Calendar";
    const settingsLink = `<a href="https://t.me/padel_dubai_bot?startapp">Open Settings</a>`;

    // Compose players and waitlist from registrations
    const maxPlayers = booking.courts * 4;
    const players = (params.registrations || []).map((r) => ({
      id: r.user.id,
      userName: r.user.username ? `@${r.user.username}` : r.user.first_name,
      skillLevel: r.user.skill_level || "E",
    }));
    const registeredPlayers = players.slice(0, maxPlayers);
    const waitlist = players.slice(maxPlayers);

    // Generate title from Date objects
    const { title } = formatGameDateTime(startTime, endTime);

    let message = `🎾 <b>${title}</b>

📍 <b>Место:</b> ${locationLink}
💵 <b>Цена:</b> ${booking.price} aed/чел
🏟️ <b>Забронировано кортов:</b> ${booking.courts}`;

    const trimmedNote = (booking.note || "").trim();
    if (trimmedNote) {
      message += `\n\n${trimmedNote}`;
    }

    if (booking.cancelled) {
      message += "\n\n❗️<b>ОТМЕНА</b>❗️";
    }

    const playerSlots = this.formatPlayerSlots(registeredPlayers, maxPlayers);
    const waitlistSection = this.formatWaitlist(waitlist);

    // Avoid extra blank line when there is no note
    const beforeCalendar = trimmedNote ? "\n\n" : "\n";
    message += `${beforeCalendar}${calendarSection}\n⚙️ ${settingsLink}

${
  booking.cancelled
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
  private static formatPlayerSlots(
    registeredPlayers: { userName: string; skillLevel: string }[],
    maxPlayers: number
  ): string {
    const slots: string[] = [];
    for (let i = 0; i < maxPlayers; i++) {
      const player = registeredPlayers[i];
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
  private static formatWaitlist(
    waitlist: { userName: string; skillLevel: string }[]
  ): string {
    if (waitlist.length === 0) {
      return "⏳ <b>Waitlist:</b>\n---";
    }
    const waitlistPlayers = waitlist
      .map(
        (player, index) =>
          `${index + 1}. ${player.userName} (${player.skillLevel})`
      )
      .join("\n");
    return `⏳ <b>Waitlist:</b>\n${waitlistPlayers}`;
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
