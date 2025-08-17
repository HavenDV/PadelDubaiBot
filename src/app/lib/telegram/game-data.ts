// Game data management - serialization, deserialization, and state management

import {
  GameInfo,
  UserRegistration,
  PlayerAction,
  AdminControlData,
} from "./types";
import { CLUB_LOCATIONS, generateCalendarLinks } from "./constants";

// Helper function to parse game date and time into Date objects
function parseGameDateTime(
  day: string,
  date: string,
  time: string
): { startTime: Date; endTime: Date } {
  const currentYear = new Date().getFullYear();

  // Parse date (e.g., "07.01" -> day 7, month 1)
  const [dayNum, monthNum] = date.split(".").map(Number);

  // Parse time range (e.g., "8:00-09:30" -> start: 8:00, end: 9:30)
  const [startTimeStr, endTimeStr] = time.split("-");
  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const [endHour, endMin] = endTimeStr.split(":").map(Number);

  // Create Date objects
  const startTime = new Date(
    currentYear,
    monthNum - 1,
    dayNum,
    startHour,
    startMin
  );
  const endTime = new Date(currentYear, monthNum - 1, dayNum, endHour, endMin);

  return { startTime, endTime };
}

export class GameDataManager {
  /**
   * Creates a GameInfo object from basic game parameters
   */
  static createGameInfo(params: {
    day: string;
    date: string;
    time: string;
    club: string;
    price: string;
    courts: number;
    note?: string;
    chatId: number;
    messageId?: number;
  }): GameInfo {
    const now = new Date();
    const gameId = `${params.day}_${params.date}_${params.time}`.replace(
      /[^a-zA-Z0-9_]/g,
      "_"
    );

    const location = {
      name: params.club,
      mapsUrl: CLUB_LOCATIONS[params.club as keyof typeof CLUB_LOCATIONS],
    };

    // Parse dates using helper function
    const { startTime, endTime } = parseGameDateTime(
      params.day,
      params.date,
      params.time
    );

    const calendarLinks = generateCalendarLinks({
      startTime,
      endTime,
      club: params.club,
    });

    return {
      id: gameId,
      title: `${params.day}, ${params.date}, ${params.time}`,
      startTime,
      endTime,
      location,
      price: params.price,
      courts: params.courts,
      maxPlayers: params.courts * 4,
      note: params.note,
      calendarLink: calendarLinks.google,
      chatId: params.chatId,
      messageId: params.messageId || 0, // Will be updated after message is sent
      cancelled: false,
      registeredPlayers: [],
      waitlist: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Updates game state with user action (registration/cancellation)
   */
  static updateGameWithUserAction(
    gameInfo: GameInfo,
    user: { id: number; userName: string },
    action: PlayerAction
  ): { updatedGame: GameInfo; notification?: string } {
    const updatedGame = { ...gameInfo };
    const now = new Date();
    updatedGame.updatedAt = now;

    // Check if user is already registered with the same skill level (cancellation)
    const existingRegistration = updatedGame.registeredPlayers.find(
      (p) => p.id === user.id
    );
    const existingWaitlist = updatedGame.waitlist.find((p) => p.id === user.id);
    const isAlreadyRegistered =
      existingRegistration?.skillLevel === action ||
      existingWaitlist?.skillLevel === action;

    // Remove user from any existing registrations first
    updatedGame.registeredPlayers = updatedGame.registeredPlayers.filter(
      (p) => p.id !== user.id
    );
    updatedGame.waitlist = updatedGame.waitlist.filter((p) => p.id !== user.id);

    // Handle the action
    if (action === "not_coming" || isAlreadyRegistered) {
      // User cancelled - already removed from lists above
      // Check if we can promote someone from waitlist
      let notification: string | undefined;

      if (
        updatedGame.registeredPlayers.length < updatedGame.maxPlayers &&
        updatedGame.waitlist.length > 0
      ) {
        const promotedPlayer = updatedGame.waitlist.shift()!; // Remove first from waitlist
        updatedGame.registeredPlayers.push(promotedPlayer); // Add to main list

        notification = `${user.userName} отменил участие. ${promotedPlayer.userName} переходит в основной состав`;
      }

      return { updatedGame, notification };
    }

    // User wants to register with a skill level
    const userRegistration: UserRegistration = {
      id: user.id,
      userName: user.userName,
      skillLevel: action,
      registrationTime: now,
    };

    let notification: string | undefined;

    // Try to add to main list first
    if (updatedGame.registeredPlayers.length < updatedGame.maxPlayers) {
      updatedGame.registeredPlayers.push(userRegistration);
    } else {
      // Add to waitlist
      updatedGame.waitlist.push(userRegistration);
      notification = `⏳ Основной список заполнен, вы добавлены в лист ожидания`;
    }

    return { updatedGame, notification };
  }

  /**
   * Cancels a game (admin action)
   */
  static cancelGame(gameInfo: GameInfo): GameInfo {
    const updatedGame = { ...gameInfo };
    updatedGame.cancelled = true;
    updatedGame.updatedAt = new Date();

    // Move all registered players to waitlist when cancelling
    updatedGame.waitlist = [
      ...updatedGame.waitlist,
      ...updatedGame.registeredPlayers,
    ];
    updatedGame.registeredPlayers = [];

    return updatedGame;
  }

  /**
   * Restores a cancelled game (admin action)
   */
  static restoreGame(gameInfo: GameInfo): GameInfo {
    const updatedGame = { ...gameInfo };
    updatedGame.cancelled = false;
    updatedGame.updatedAt = new Date();
    return updatedGame;
  }

  /**
   * Gets game statistics
   */
  static getGameStats(gameInfo: GameInfo): {
    registeredCount: number;
    waitlistCount: number;
    totalParticipants: number;
    availableSlots: number;
  } {
    return {
      registeredCount: gameInfo.registeredPlayers.length,
      waitlistCount: gameInfo.waitlist.length,
      totalParticipants:
        gameInfo.registeredPlayers.length + gameInfo.waitlist.length,
      availableSlots: Math.max(
        0,
        gameInfo.maxPlayers - gameInfo.registeredPlayers.length
      ),
    };
  }

  /**
   * Checks if a cancellation is within 24 hours of game time
   */
  static isLateCancellation(gameInfo: GameInfo): {
    isLate: boolean;
    hoursRemaining: number | null;
  } {
    try {
      const now = new Date();
      const timeDiffMs = gameInfo.startTime.getTime() - now.getTime();
      const hoursRemaining = timeDiffMs / (1000 * 60 * 60);

      return {
        isLate: hoursRemaining < 24 && hoursRemaining > 0,
        hoursRemaining: hoursRemaining > 0 ? hoursRemaining : null,
      };
    } catch (error) {
      console.error("Error checking late cancellation:", error);
      return { isLate: false, hoursRemaining: null };
    }
  }

  /**
   * Creates admin control data for private admin messages
   */
  static createAdminControlData(gameInfo: GameInfo): AdminControlData {
    return {
      gameId: gameInfo.id,
      chatId: gameInfo.chatId,
      messageId: gameInfo.messageId,
      originalGameData: { ...gameInfo },
    };
  }

  /**
   * Extracts admin control data from admin message
   * Uses simple regex parsing to extract chat ID and message ID
   */
  static extractAdminControlDataFromMessage(
    messageText: string
  ): AdminControlData | null {
    try {
      // Parse Chat ID and Message ID from the admin message
      const chatIdMatch = messageText.match(/Chat ID: (-?\d+)/);
      const messageIdMatch = messageText.match(/Message ID: (\d+)/);

      if (!chatIdMatch || !messageIdMatch) {
        return null;
      }

      const chatId = parseInt(chatIdMatch[1]);
      const messageId = parseInt(messageIdMatch[1]);

      // Since we can't get the full original game data from the admin message,
      // we'll create a minimal structure that can be used for basic operations
      return {
        gameId: `admin_${chatId}_${messageId}`,
        chatId,
        messageId,
        originalGameData: null as unknown as GameInfo, // Will need to be fetched from the actual game message
      };
    } catch (error) {
      console.error("Error extracting admin control data from message:", error);
      return null;
    }
  }
}
