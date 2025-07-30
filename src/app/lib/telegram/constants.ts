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
}) => `🎾 <b>${gameInfo.day}, ${gameInfo.date}, ${gameInfo.time}</b>

📍 <b>Место:</b> ${gameInfo.club}
💵 <b>Цена:</b> ${gameInfo.price}
🏟️ <b>Забронировано кортов:</b> ${gameInfo.courts}${
  gameInfo.note ? `\n\n${gameInfo.note}` : ""
}${gameInfo.cancelled ? "\n\n❗️<b>ОТМЕНА</b>❗️" : ""}

${gameInfo.cancelled ? "Игра отменена. Waitlist:" : "Записавшиеся игроки:"}`;

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти на эту игру!",
  REGISTERED: (level: string) => `Записал вас с уровнем ${level}!`,
} as const;
