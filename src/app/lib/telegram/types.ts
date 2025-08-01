// Core data types for the padel game management system

export interface UserRegistration {
  id: number; // Telegram user ID
  userName: string; // Display name (username or first_name)
  skillLevel: string; // E, D, D+, C-, C, C+
  registrationTime: Date;
}

export interface GameLocation {
  name: string;
  mapsUrl?: string;
}

export interface GameInfo {
  id: string; // Unique identifier for the game
  title: string; // e.g., "Вторник, 15.01, 8:00-09:30"

  // Date and time information
  startTime: Date; // Game start time
  endTime: Date; // Game end time

  location: GameLocation;
  price: string;
  courts: number;
  maxPlayers: number; // courts * 4
  note?: string;
  calendarLink?: string;

  // Message metadata
  chatId: number;
  messageId: number;

  // Game state
  cancelled: boolean;
  registeredPlayers: UserRegistration[];
  waitlist: UserRegistration[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface GameState {
  cancelled: boolean;
  registeredPlayers: UserRegistration[];
  waitlist: UserRegistration[];
  updatedAt: Date;
}

export interface MessageData {
  gameInfo: GameInfo;
  // Embedded serialized data (base64 encoded JSON)
  serializedData: string;
}

export interface AdminControlData {
  gameId: string;
  chatId: number;
  messageId: number;
  originalGameData: GameInfo;
}

// Skill level definitions
export const SKILL_LEVELS = {
  E: "First time",
  D: "Beginner",
  "D+": "Control direction, know rules",
  "C-": "Defense & attack",
  C: "Defense to attack",
  "C+": "Change pace & play",
} as const;

export type SkillLevel = keyof typeof SKILL_LEVELS;

// Game status types
export type GameStatus = "active" | "cancelled" | "completed";

// Action types for game management
export type AdminAction = "cancel_game" | "restore_game" | "game_stats";
export type PlayerAction = SkillLevel | "not_coming";
