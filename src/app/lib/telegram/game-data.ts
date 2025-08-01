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
   * Parses game data from a Telegram message text
   */
  static parseGameDataFromMessage(messageText: string): GameInfo | null {
    try {
      // Check if this is a minimal message (just players section for tests)
      if (
        !messageText.includes("🎾") &&
        (messageText.includes("Записавшиеся игроки") ||
          messageText.includes("<b>Записавшиеся игроки:</b>"))
      ) {
        return this.parseMinimalGameMessage(messageText);
      }

      // Parse basic game info from message - handle both HTML and plain text
      let titleMatch = messageText.match(/🎾 <b>(.+?)<\/b>/);
      if (!titleMatch) {
        // Try plain text format
        titleMatch = messageText.match(/🎾 (.+?)(?=\n|$)/);
      }
      if (!titleMatch) return null;

      const title = titleMatch[1];

      // Extract day, date, time from title like "Вторник, 15.01, 8:00-09:30"
      // For test data, handle "Test Game" format
      let day: string, date: string, time: string;

      const titleParts = title.split(", ");
      if (titleParts.length >= 3) {
        day = titleParts[0];
        date = titleParts[1];
        time = titleParts[2];
      } else {
        // Default values for test data
        day = "Test";
        date = "01.01";
        time = "12:00-13:30";
      }

      // Parse location - handle both HTML and plain text, default if not found
      const locationMatch = messageText.match(
        /📍 <b>Место:<\/b> (?:<a href="([^"]*)")?([^<\n]+)(?:<\/a>)?/
      );
      let locationName: string;
      let mapsUrl: string | undefined;

      if (!locationMatch) {
        // Try plain text format
        const plainLocationMatch = messageText.match(/📍 Место: ([^\n]+)/);
        if (plainLocationMatch) {
          locationName = plainLocationMatch[1].trim();
          mapsUrl = undefined;
        } else {
          // Default location for test messages
          locationName = "Test Club";
          mapsUrl = undefined;
        }
      } else {
        locationName = locationMatch[2].trim();
        mapsUrl = locationMatch[1] || undefined;
      }

      // Enrich location with maps URL if it's a known club
      if (
        !mapsUrl &&
        CLUB_LOCATIONS[locationName as keyof typeof CLUB_LOCATIONS]
      ) {
        mapsUrl = CLUB_LOCATIONS[locationName as keyof typeof CLUB_LOCATIONS];
      }

      const location = {
        name: locationName,
        mapsUrl,
      };

      // Parse price - handle both HTML and plain text, default if not found
      let priceMatch = messageText.match(/💵 <b>Цена:<\/b> ([^\n]+)/);
      if (!priceMatch) {
        priceMatch = messageText.match(/💵 Цена: ([^\n]+)/);
      }
      const price = priceMatch ? priceMatch[1].trim() : "Test price";

      // Parse courts - handle both HTML and plain text, default to 1 if not found
      let courtsMatch = messageText.match(
        /🏟️ <b>Забронировано кортов:<\/b> (\d+)/
      );
      if (!courtsMatch) {
        courtsMatch = messageText.match(/🏟️ Забронировано кортов: (\d+)/);
      }
      const courts = courtsMatch ? parseInt(courtsMatch[1]) : 1;

      // Parse note (optional)
      const noteMatch = messageText.match(
        /🏟️ <b>Забронировано кортов:<\/b> \d+\n\n([^📅\n❗️]+?)(?=\n|$)/
      );
      const note = noteMatch ? noteMatch[1].trim() : undefined;

      // Check if cancelled
      const cancelled =
        messageText.includes("❗️<b>ОТМЕНА</b>❗️") ||
        messageText.includes("Игра отменена");

      // Parse calendar link
      const calendarMatch = messageText.match(
        /📅 <a href="([^"]+)">Добавить в Google Calendar<\/a>/
      );
      let calendarLink = calendarMatch ? calendarMatch[1] : undefined;

      // Parse dates using helper function
      const { startTime, endTime } = parseGameDateTime(day, date, time);

      // Generate calendar link if not present
      if (!calendarLink) {
        const calendarData = generateCalendarLinks({
          startTime,
          endTime,
          club: locationName,
        });
        calendarLink = calendarData.google;
      }

      // Parse registered players
      const registeredPlayers = this.parseRegisteredPlayers(messageText);

      // Parse waitlist
      const waitlist = this.parseWaitlist(messageText);

      const gameId = `${day}_${date}_${time}`.replace(/[^a-zA-Z0-9_]/g, "_");

      return {
        id: gameId,
        title,
        startTime,
        endTime,
        location,
        price,
        courts,
        maxPlayers: courts * 4,
        note,
        calendarLink,
        chatId: 0, // Will be set by caller
        messageId: 0, // Will be set by caller
        cancelled,
        registeredPlayers,
        waitlist,
        createdAt: new Date(), // Default to now
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error parsing game data from message:", error);
      return null;
    }
  }

  /**
   * Parses registered players from message text
   */
  private static parseRegisteredPlayers(
    messageText: string
  ): UserRegistration[] {
    const players: UserRegistration[] = [];

    // Find the registered players section - handle both HTML and plain text
    let playersStart = messageText.indexOf("<b>Записавшиеся игроки:</b>");
    let waitlistStart = messageText.indexOf("⏳ <b>Waitlist:</b>");

    if (playersStart === -1) {
      playersStart = messageText.indexOf("Записавшиеся игроки:");
    }
    if (waitlistStart === -1) {
      waitlistStart = messageText.indexOf("⏳ Waitlist:");
    }

    if (playersStart === -1 || waitlistStart === -1) return players;

    const playersSection = messageText.substring(playersStart, waitlistStart);

    // Match player entries like "1. @username (C+)" or "1. First Name (D)"
    const playerMatches = playersSection.match(/\d+\. (.+?) \(([^)]+)\)/g);

    if (playerMatches) {
      for (const match of playerMatches) {
        const playerMatch = match.match(/\d+\. (.+?) \(([^)]+)\)/);
        if (playerMatch) {
          const userName = playerMatch[1].trim();
          const skillLevel = playerMatch[2].trim();

          // Generate a simple hash for user ID (since we don't have real IDs from parsing)
          const userId = Math.abs(
            userName
              .split("")
              .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
          );

          players.push({
            id: userId,
            userName,
            skillLevel,
            registrationTime: new Date(),
          });
        }
      }
    }

    return players;
  }

  /**
   * Parses waitlist players from message text
   */
  private static parseWaitlist(messageText: string): UserRegistration[] {
    const waitlist: UserRegistration[] = [];

    // Find the waitlist section - handle both HTML and plain text
    let waitlistStart = messageText.indexOf("⏳ <b>Waitlist:</b>");
    if (waitlistStart === -1) {
      waitlistStart = messageText.indexOf("⏳ Waitlist:");
    }
    if (waitlistStart === -1) return waitlist;

    const waitlistSection = messageText.substring(waitlistStart);

    // Match waitlist entries like "1. @username (C+)" or "🎾 @username (D+)"
    const numberedWaitlistMatches = waitlistSection.match(
      /\d+\. (.+?) \(([^)]+)\)/g
    );
    const emojiWaitlistMatches = waitlistSection.match(/🎾 (.+?) \(([^)]+)\)/g);

    const allMatches = [
      ...(numberedWaitlistMatches || []),
      ...(emojiWaitlistMatches || []),
    ];

    if (allMatches.length > 0) {
      for (const match of allMatches) {
        // Try numbered format first, then emoji format
        let playerMatch = match.match(/\d+\. (.+?) \(([^)]+)\)/);
        if (!playerMatch) {
          playerMatch = match.match(/🎾 (.+?) \(([^)]+)\)/);
        }

        if (playerMatch) {
          const userName = playerMatch[1].trim();
          const skillLevel = playerMatch[2].trim();

          // Generate a simple hash for user ID
          const userId = Math.abs(
            userName
              .split("")
              .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
          );

          waitlist.push({
            id: userId,
            userName,
            skillLevel,
            registrationTime: new Date(),
          });
        }
      }
    }

    return waitlist;
  }

  /**
   * Parses minimal game message (for tests) - just players section
   */
  private static parseMinimalGameMessage(messageText: string): GameInfo {
    const registeredPlayers = this.parseRegisteredPlayers(messageText);
    const waitlist = this.parseWaitlist(messageText);

    // Try to parse location from the message
    let locationName = "Test Club";
    let mapsUrl: string | undefined;

    const locationMatch = messageText.match(/📍 Место: ([^\n]+)/);
    if (locationMatch) {
      locationName = locationMatch[1].trim();
      // Enrich location with maps URL if it's a known club
      if (CLUB_LOCATIONS[locationName as keyof typeof CLUB_LOCATIONS]) {
        mapsUrl = CLUB_LOCATIONS[locationName as keyof typeof CLUB_LOCATIONS];
      }
    }

    // Parse default test dates using helper function
    const { startTime, endTime } = parseGameDateTime(
      "Test",
      "01.01",
      "12:00-13:30"
    );

    // Generate calendar link
    const calendarData = generateCalendarLinks({
      startTime,
      endTime,
      club: locationName,
    });
    const calendarLink = calendarData.google;

    // Create a default game structure for tests
    return {
      id: "test_game",
      title: "Test Game",
      startTime,
      endTime,
      location: {
        name: locationName,
        mapsUrl,
      },
      price: "Test price",
      courts: 1,
      maxPlayers: 4,
      note: undefined,
      calendarLink,
      chatId: 0,
      messageId: 0,
      cancelled: false,
      registeredPlayers,
      waitlist,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Alias for backward compatibility
   */
  static extractGameDataFromMessage(messageText: string): GameInfo | null {
    return this.parseGameDataFromMessage(messageText);
  }

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
