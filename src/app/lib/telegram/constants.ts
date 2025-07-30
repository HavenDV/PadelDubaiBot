// Telegram padel constants
export const SKILL_LEVEL_BUTTONS = [
  [
    { text: "D- (Beginner)", callback_data: "skill_D-" },
    { text: "D (Intermediate)", callback_data: "skill_D" },
  ],
  [
    { text: "D+ (Advanced)", callback_data: "skill_D+" },
    { text: "C- (Expert)", callback_data: "skill_C-" },
  ],
  [{ text: "❌ Не приду", callback_data: "skill_not_coming" }],
];

// Weekly schedule template for the main message
export const WEEKLY_SCHEDULE_TEMPLATE = `🏓 <b>Расписание Padel на неделю</b> 🏓

Друзья, привет! ❗️

Ниже расписание игр на эту неделю. Для каждой игры будет отдельное сообщение с записью.

Выберите подходящие вам игры и укажите ваш уровень! 🎾`;

// Club locations with Google Maps links
export const CLUB_LOCATIONS = {
  "SANDDUNE PADEL CLUB Al Qouz":
    "https://maps.app.goo.gl/GZgQCpsX1uyvFwLB7?g_st=ipc",
  "Oxygen Padel Sport Academy":
    "https://maps.app.goo.gl/cH1EZrrpbuYVWsMY6?g_st=ipc",
} as const;

// Helper function to generate calendar links
export const generateCalendarLinks = (gameInfo: {
  day: string;
  date: string;
  time: string;
  club: string;
}) => {
  // Parse date and time for calendar
  const [startTime, endTime] = gameInfo.time.split("-");
  const [day, month] = gameInfo.date.split(".");
  const year = new Date().getFullYear();

  // Create start and end dates (Dubai timezone)
  const startDate = new Date(year, parseInt(month) - 1, parseInt(day));
  const [startHour, startMinute] = startTime.split(":");
  startDate.setHours(parseInt(startHour), parseInt(startMinute));

  const endDate = new Date(startDate);
  const [endHour, endMinute] = endTime.split(":");
  endDate.setHours(parseInt(endHour), parseInt(endMinute));

  // Convert to UTC for calendar URLs
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
}) => {
  const mapLink = CLUB_LOCATIONS[gameInfo.club as keyof typeof CLUB_LOCATIONS];
  const calendar = generateCalendarLinks(gameInfo);

  return `🎾 <b>${gameInfo.day}, ${gameInfo.date}, ${gameInfo.time}</b>

📍 <b>Место:</b> <a href="${mapLink}">${gameInfo.club}</a>
💵 <b>Цена:</b> ${gameInfo.price}
🏟️ <b>Забронировано кортов:</b> ${gameInfo.courts}${
    gameInfo.note ? `\n\n${gameInfo.note}` : ""
  }${gameInfo.cancelled ? "\n\n❗️<b>ОТМЕНА</b>❗️" : ""}

📅 <a href="${calendar.google}">Добавить в Google Calendar</a>

${gameInfo.cancelled ? "Игра отменена. Waitlist:" : "Записавшиеся игроки:"}`;
};

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти на эту игру!",
  REGISTERED: (level: string) => `Записал вас с уровнем ${level}!`,
} as const;
