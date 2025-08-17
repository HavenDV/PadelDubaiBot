import { Location } from "../../../../database.types";

// Simplified registration buttons - users select from their profile skill level
export const REGISTRATION_BUTTONS = [
  [{ text: "🎾 Записаться", callback_data: "join_game" }],
  [{ text: "❌ Не приду", callback_data: "leave_game" }],
];

// Weekly schedule template for the main message
export const WEEKLY_SCHEDULE_TEMPLATE = `🏓 <b>Расписание Padel на следующую неделю</b> 🏓

Друзья, привет! ❗️

Выберите подходящие вам игры и укажите ваш уровень! 🎾`;

// Welcome message template for new group members
export const WELCOME_MESSAGE_TEMPLATE = (
  firstName: string
) => `Привет ${firstName} 🎾!
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
📊 Подробнее об уровнях: <a href="https://t.me/PadDXB/124">Как определить свой уровень</a>

💬 Если есть вопросы — не стесняйся писать в чат или в личку. Мы всегда на связи!

До встречи на корте! 🏆`;

// Helper function to generate calendar links
export const generateCalendarLinks = (gameInfo: {
  startTime: Date;
  endTime: Date;
  club: string;
}) => {
  // Use the provided Date objects directly (already in local timezone)
  const startDate = gameInfo.startTime;
  const endDate = gameInfo.endTime;

  // Convert to UTC for calendar URLs (Dubai is UTC+4, so we subtract 4 hours)
  const startUTC = new Date(startDate.getTime() - 4 * 60 * 60 * 1000); // Dubai is UTC+4
  const endUTC = new Date(endDate.getTime() - 4 * 60 * 60 * 1000);

  // Format for calendar URLs
  const formatForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const title = encodeURIComponent(`Padel - ${gameInfo.club}`);
  const location = encodeURIComponent(gameInfo.club);
  const startFormatted = formatForCalendar(startUTC);
  const endFormatted = formatForCalendar(endUTC);

  const googleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&location=${location}`;

  return { google: googleCalendar };
};

// Template for individual game messages
export const GAME_MESSAGE_TEMPLATE = (gameInfo: {
  day: string;
  date: string;
  time: string;
  club: string;
  price: string;
  courts: number;
  note?: string;
  cancelled?: boolean;
  location: Location;
}) => {
  // Convert string date/time to Date objects for calendar generation
  const [dayNum, monthNum] = gameInfo.date.split(".").map(Number);
  const [startTimeStr, endTimeStr] = gameInfo.time.split("-");
  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const [endHour, endMin] = endTimeStr.split(":").map(Number);

  const currentYear = new Date().getFullYear();
  const startTime = new Date(
    currentYear,
    monthNum - 1,
    dayNum,
    startHour,
    startMin
  );
  const endTime = new Date(currentYear, monthNum - 1, dayNum, endHour, endMin);

  const calendar = generateCalendarLinks({
    startTime,
    endTime,
    club: gameInfo.club,
  });

  return `🎾 <b>${gameInfo.day}, ${gameInfo.date}, ${gameInfo.time}</b>

📍 <b>Место:</b> <a href="${gameInfo.location.url}">${
    gameInfo.location.name
  }</a>
💵 <b>Цена:</b> ${gameInfo.price}
🏟️ <b>Забронировано кортов:</b> ${gameInfo.courts}${
    gameInfo.note ? `\n\n${gameInfo.note}` : ""
  }${gameInfo.cancelled ? "\n\n❗️<b>ОТМЕНА</b>❗️" : ""}

📅 <a href="${calendar.google}">Добавить в Google Calendar</a>

${gameInfo.cancelled ? "Игра отменена. Waitlist:" : "Записавшиеся игроки:"}
${Array.from({ length: gameInfo.courts * 4 }, (_, i) => `${i + 1}. -`).join(
  "\n"
)}

⏳ <b>Waitlist:</b>
---`;
};

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти на эту игру!",
  REGISTERED: (level: string) => `Записал вас с уровнем ${level}!`,
  LATE_CANCELLATION_WARNING: (
    hoursRemaining: number
  ) => `⚠️ ВНИМАНИЕ! До игры осталось ${hoursRemaining.toFixed(1)} часов.

Согласно правилам группы, отмена менее чем за 24 часа до игры влечет штрафные санкции.

Подробности в правилах участия в группе.

Вы все еще хотите отменить участие?`,
  // Admin callback messages
  ADMIN_UNAUTHORIZED:
    "❌ У вас нет прав администратора для выполнения этого действия.",
  ADMIN_GAME_CANCELLED:
    "🚫 Игра отменена. Сохранена вся информация об игре, показано '🚫 Игра отменена'. Легко восстановить!",
  ADMIN_GAME_RESTORED:
    "✅ Игра восстановлена. Восстановлена вся информация об игре с пустыми слотами для регистрации.",
  ADMIN_GAME_STATS: (registeredCount: number, waitlistCount: number) =>
    `📊 Статистика игры:\n\n👥 Записано игроков: ${registeredCount}\n⏳ В waitlist: ${waitlistCount}\n📈 Всего участников: ${
      registeredCount + waitlistCount
    }`,
} as const;
