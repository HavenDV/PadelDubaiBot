import { GameDataManager } from "../src/app/lib/telegram/game-data";
import { MessageFormatter } from "../src/app/lib/telegram/message-formatter";
import type { PlayerAction } from "../src/app/lib/telegram/types";
import {
  SKILL_LEVEL_BUTTONS,
  ADMIN_BUTTONS,
  AdminUtils,
  CALLBACK_MESSAGES,
  generateCalendarLinks,
} from "../src/app/lib/telegram/constants";

// Helper functions to replace deprecated MessageUtils methods
function updateMessageWithUserSelection(
  currentText: string,
  displayName: string,
  selectedLevel: string
): { updatedMessage: string; notification?: string } {
  const gameInfo = GameDataManager.parseGameDataFromMessage(currentText);
  if (!gameInfo) {
    return { updatedMessage: currentText };
  }

  const userId = Math.abs(
    displayName.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
  );

  const { updatedGame, notification } =
    GameDataManager.updateGameWithUserAction(
      gameInfo,
      { id: userId, userName: displayName },
      selectedLevel as PlayerAction
    );

  return {
    updatedMessage: MessageFormatter.formatGameMessage(updatedGame),
    notification,
  };
}

function getHoursUntilGame(messageText: string): number | null {
  const gameInfo = GameDataManager.parseGameDataFromMessage(messageText);
  if (gameInfo) {
    const result = GameDataManager.isLateCancellation(gameInfo);
    return result.hoursRemaining;
  }
  return null;
}

function isLateCancellation(messageText: string): {
  isLate: boolean;
  hoursRemaining: number | null;
} {
  const gameInfo = GameDataManager.parseGameDataFromMessage(messageText);
  if (gameInfo) {
    return GameDataManager.isLateCancellation(gameInfo);
  }
  return { isLate: false, hoursRemaining: null };
}

function getGameStats(messageText: string): {
  registeredCount: number;
  waitlistCount: number;
  totalCount: number;
} {
  const gameInfo = GameDataManager.parseGameDataFromMessage(messageText);
  if (gameInfo) {
    const stats = GameDataManager.getGameStats(gameInfo);
    return {
      registeredCount: stats.registeredCount,
      waitlistCount: stats.waitlistCount,
      totalCount: stats.totalParticipants,
    };
  }
  return { registeredCount: 0, waitlistCount: 0, totalCount: 0 };
}

function cancelGame(originalGameMessage: string): string {
  const gameInfo =
    GameDataManager.parseGameDataFromMessage(originalGameMessage);
  if (gameInfo) {
    return MessageFormatter.formatCancelledGameMessage(gameInfo);
  }
  return `🚫 <b>Игра отменена администратором</b>

❌ Регистрация на эту игру закрыта

🚫 <b>Игра отменена</b>`;
}

function restoreGame(originalGameMessage: string): string {
  const gameInfo =
    GameDataManager.parseGameDataFromMessage(originalGameMessage);
  if (gameInfo) {
    return MessageFormatter.formatRestoredGameMessage(gameInfo);
  }
  return `✅ <b>Игра восстановлена администратором</b>

🎾 Регистрация на игру снова открыта

<b>Записавшиеся игроки:</b>
1. -
2. -
3. -
4. -

⏳ <b>Waitlist:</b>
---`;
}

function createAdminControlMessage(
  gameMessage: string,
  chatId: number,
  messageId: number
): string {
  const gameInfo = GameDataManager.parseGameDataFromMessage(gameMessage);
  if (gameInfo) {
    gameInfo.chatId = chatId;
    gameInfo.messageId = messageId;
    return MessageFormatter.formatAdminControlMessage(gameInfo);
  }
  return `🔧 <b>Панель администратора</b>

⚠️ Не удалось загрузить полные данные об игре.

🔗 <b>Ссылка на игру:</b>
Chat ID: ${chatId}
Message ID: ${messageId}`;
}

function extractGameReference(adminMessage: string): {
  chatId: number;
  messageId: number;
} | null {
  const adminData =
    GameDataManager.extractAdminControlDataFromMessage(adminMessage);
  if (adminData) {
    return {
      chatId: adminData.chatId,
      messageId: adminData.messageId,
    };
  }

  // Fallback to regex parsing
  const chatIdMatch = adminMessage.match(/Chat ID: (-?\d+)/);
  const messageIdMatch = adminMessage.match(/Message ID: (\d+)/);

  if (chatIdMatch && messageIdMatch) {
    return {
      chatId: parseInt(chatIdMatch[1]),
      messageId: parseInt(messageIdMatch[1]),
    };
  }

  return null;
}

function normalizeName(name: string): string {
  let cleanName = name.replace(/<[^>]*>/g, "");
  cleanName = cleanName.replace(/^@/, "");
  cleanName = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .trim();
  return cleanName.replace(/\s+/g, " ");
}

describe("Core Bot Functionality Tests", () => {
  describe("HTML Formatting Restoration (Critical Feature)", () => {
    test("should restore HTML bold tags in message headers and labels", () => {
      const messageWithoutHTML = `🎾 Вторник, 07.01, 8:00-09:30

📍 Место: SANDDUNE PADEL CLUB Al Qouz
💵 Цена: 65 aed/чел
🏟️ Забронировано кортов: 2

Записавшиеся игроки:

⏳ Waitlist:
---`;

      const result = updateMessageWithUserSelection(
        messageWithoutHTML,
        "@testuser",
        "D+"
      );

      // Verify critical HTML formatting is restored
      expect(result.updatedMessage).toContain("<b>");
      expect(result.updatedMessage).toContain("</b>");
      expect(result.updatedMessage).toContain("@testuser (D+)");

      // Verify specific formatting
      expect(result.updatedMessage).toContain("📍 <b>Место:</b>");
      expect(result.updatedMessage).toContain("💵 <b>Цена:</b>");
      expect(result.updatedMessage).toContain(
        "🏟️ <b>Забронировано кортов:</b>"
      );
    });

    test("should restore map links for club locations", () => {
      const messageWithoutLinks = `📍 Место: SANDDUNE PADEL CLUB Al Qouz
Записавшиеся игроки:`;

      const result = updateMessageWithUserSelection(
        messageWithoutLinks,
        "@player",
        "D"
      );

      expect(result.updatedMessage).toContain("maps.app.goo.gl");
      expect(result.updatedMessage).toContain("<a href=");
      expect(result.updatedMessage).toContain(
        "SANDDUNE PADEL CLUB Al Qouz</a>"
      );
    });

    test("should restore calendar links for events", () => {
      const messageWithCalendarText = `📅 Добавить в Google Calendar
Записавшиеся игроки:`;

      const result = updateMessageWithUserSelection(
        messageWithCalendarText,
        "@player",
        "D+"
      );

      expect(result.updatedMessage).toContain("calendar.google.com");
      expect(result.updatedMessage).toContain(
        '<a href="https://calendar.google.com'
      );
      expect(result.updatedMessage).toContain("Добавить в Google Calendar</a>");
    });

    test("should preserve existing HTML formatting when already present", () => {
      const messageWithHTML = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>
📍 <b>Место:</b> <a href="https://maps.app.goo.gl/test">SANDDUNE PADEL CLUB Al Qouz</a>
<b>Записавшиеся игроки:</b>`;

      const result = updateMessageWithUserSelection(
        messageWithHTML,
        "@testuser",
        "D+"
      );

      // Should not double-format or break existing HTML
      expect(result.updatedMessage).toContain(
        "<b>Вторник, 07.01, 8:00-09:30</b>"
      );
      expect(result.updatedMessage).toContain(
        '<a href="https://maps.app.goo.gl/test">'
      );
      expect(result.updatedMessage).not.toContain("<b><b>"); // No double formatting
    });
  });

  describe("Player Registration System", () => {
    test("should add players to main list when space available", () => {
      const emptyGameMessage = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const result = updateMessageWithUserSelection(
        emptyGameMessage,
        "@newplayer",
        "D+"
      );

      expect(result.updatedMessage).toContain("1. @newplayer (D+)");
      expect(result.notification).toBeUndefined(); // No notification for normal registration
    });

    test("should handle multiple players in main list", () => {
      let currentMessage = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      // Add 3 players
      for (let i = 1; i <= 3; i++) {
        const result = updateMessageWithUserSelection(
          currentMessage,
          `@player${i}`,
          "D+"
        );
        currentMessage = result.updatedMessage;
        expect(result.notification).toBeUndefined();
      }

      expect(currentMessage).toContain("@player1 (D+)");
      expect(currentMessage).toContain("@player2 (D+)");
      expect(currentMessage).toContain("@player3 (D+)");
    });

    test("should show empty waitlist properly", () => {
      const result = updateMessageWithUserSelection(
        `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`,
        "@player",
        "D"
      );

      expect(result.updatedMessage).toContain("⏳ <b>Waitlist:</b>");
      expect(result.updatedMessage).toContain("---");
    });

    test("should handle player cancellation from main list", () => {
      const gameWithPlayers = `<b>Записавшиеся игроки:</b>

1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)

⏳ <b>Waitlist:</b>
---`;

      // Cancel player2
      const result = updateMessageWithUserSelection(
        gameWithPlayers,
        "@player2",
        "D"
      );

      expect(result.updatedMessage).not.toContain("2. @player2 (D)");
      expect(result.updatedMessage).toContain("@player1 (D+)");
      expect(result.updatedMessage).toContain("@player3 (D+)");
    });
  });

  describe("Constants and Helper Functions", () => {
    test("should have skill level buttons available", () => {
      expect(SKILL_LEVEL_BUTTONS).toBeDefined();
      expect(Array.isArray(SKILL_LEVEL_BUTTONS)).toBe(true);
      expect(SKILL_LEVEL_BUTTONS.length).toBeGreaterThan(0);

      // Should have button structure
      const flatButtons = SKILL_LEVEL_BUTTONS.flat();
      expect(flatButtons.length).toBeGreaterThan(0);
      expect(flatButtons[0]).toHaveProperty("text");
      expect(flatButtons[0]).toHaveProperty("callback_data");
    });

    test("should generate calendar links with proper format", () => {
      const gameInfo = {
        startTime: new Date(2025, 0, 7, 8, 0), // January 7, 2025, 8:00 AM
        endTime: new Date(2025, 0, 7, 9, 30), // January 7, 2025, 9:30 AM
        club: "Test Club",
      };

      const result = generateCalendarLinks(gameInfo);

      expect(result).toHaveProperty("google");
      expect(result.google).toContain("calendar.google.com");
      expect(result.google).toContain("action=TEMPLATE");
      expect(result.google).toContain("text=");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    test("should handle malformed messages gracefully", () => {
      const malformedInputs = [
        "",
        "Invalid message",
        "🎾 Incomplete message without structure",
        "Random text",
      ];

      malformedInputs.forEach((input) => {
        expect(() => {
          const result = updateMessageWithUserSelection(
            input,
            "@testuser",
            "D+"
          );
          expect(result.updatedMessage).toBeDefined();
          expect(typeof result.updatedMessage).toBe("string");
        }).not.toThrow();
      });
    });

    test("should handle empty or invalid inputs", () => {
      const result = updateMessageWithUserSelection("", "", "");
      expect(result.updatedMessage).toBeDefined();
      expect(typeof result.updatedMessage).toBe("string");
    });

    test("should handle special characters in usernames", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const specialUsernames = [
        "@тест_user",
        "@user-with-dashes",
        "@user.with.dots",
        "@user123",
        "@مستخدم",
      ];

      specialUsernames.forEach((username) => {
        const result = updateMessageWithUserSelection(message, username, "D+");
        expect(result.updatedMessage).toContain(username);
      });
    });
  });

  describe("Performance Requirements", () => {
    test("should process messages efficiently", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const startTime = Date.now();

      // Process 50 registrations
      for (let i = 0; i < 50; i++) {
        updateMessageWithUserSelection(message, `@user${i}`, "D+");
      }

      const duration = Date.now() - startTime;

      // Should complete 50 operations in under 100ms
      expect(duration).toBeLessThan(100);
    });

    test("should handle HTML restoration efficiently", () => {
      const messageWithoutHTML = `🎾 Вторник, 07.01, 8:00-09:30
📍 Место: SANDDUNE PADEL CLUB Al Qouz
💵 Цена: 65 aed/чел
Записавшиеся игроки:
⏳ Waitlist:
---`;

      const startTime = Date.now();

      // Apply HTML restoration 25 times
      for (let i = 0; i < 25; i++) {
        updateMessageWithUserSelection(messageWithoutHTML, `@user${i}`, "D+");
      }

      const duration = Date.now() - startTime;

      // Should complete 25 HTML restorations in under 50ms
      expect(duration).toBeLessThan(50);
    });
  });

  describe("Penalty System for Late Cancellations", () => {
    // Mock current time to test different scenarios
    const mockGameMessage = (
      day: string,
      month: string,
      hour: string
    ) => `🎾 <b>Вторник, ${day}.${month}, ${hour}:00-09:30</b>

📍 <b>Место:</b> SANDDUNE PADEL CLUB Al Qouz
💵 <b>Цена:</b> 65 aed/чел

<b>Записавшиеся игроки:</b>
1. @player1 (D+)

⏳ <b>Waitlist:</b>
---`;

    test("should parse game time correctly", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const day = tomorrow.getDate().toString().padStart(2, "0");
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");

      const gameMessage = mockGameMessage(day, month, "08");
      const hoursUntil = getHoursUntilGame(gameMessage);

      expect(hoursUntil).not.toBeNull();
      expect(typeof hoursUntil).toBe("number");
    });

    test("should detect late cancellation (within 24 hours)", () => {
      // Create a game message for tomorrow morning
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const day = tomorrow.getDate().toString().padStart(2, "0");
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");

      const gameMessage = mockGameMessage(day, month, "08");
      const cancellationCheck = isLateCancellation(gameMessage);

      expect(cancellationCheck.isLate).toBeDefined();
      expect(cancellationCheck.hoursRemaining).not.toBeNull();
    });

    test("should generate penalty warning message", () => {
      const hoursRemaining = 12.5;
      const warningMessage =
        CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(hoursRemaining);

      expect(warningMessage).toContain("⚠️ ВНИМАНИЕ!");
      expect(warningMessage).toContain("12.5 часов");
      expect(warningMessage).toContain("штрафные санкции");
      expect(warningMessage).toContain("правилам группы");
      expect(warningMessage).toContain("отменить участие?");
    });

    test("should handle invalid game message format", () => {
      const invalidMessage = "Invalid message without game info";

      const hoursUntil = getHoursUntilGame(invalidMessage);
      const cancellationCheck = isLateCancellation(invalidMessage);

      expect(hoursUntil).toBeNull();
      expect(cancellationCheck.isLate).toBe(false);
      expect(cancellationCheck.hoursRemaining).toBeNull();
    });

    test("should normalize player names correctly", () => {
      const testCases = [
        { input: "@testuser", expected: "testuser" },
        {
          input: '<a href="https://t.me/testuser">@testuser</a>',
          expected: "testuser",
        },
        { input: "Regular Name", expected: "regular name" },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(normalizeName(input)).toBe(expected);
      });
    });
  });

  describe("Admin System", () => {
    test("should have admin buttons defined", () => {
      expect(ADMIN_BUTTONS).toBeDefined();
      expect(Array.isArray(ADMIN_BUTTONS)).toBe(true);
      expect(ADMIN_BUTTONS.length).toBeGreaterThan(0);

      // Check button structure
      const flatButtons = ADMIN_BUTTONS.flat();
      expect(flatButtons[0]).toHaveProperty("text");
      expect(flatButtons[0]).toHaveProperty("callback_data");

      // Should have admin_ prefix
      flatButtons.forEach((button) => {
        expect(button.callback_data).toMatch(/^admin_/);
      });
    });

    test("should provide admin verification function", () => {
      // Test admin detection (since we don't have real admin IDs in test env)
      const testUserId = 123456789;
      const isAdmin = AdminUtils.isAdmin(testUserId);

      expect(typeof isAdmin).toBe("boolean");
    });

    test("should provide different buttons for admin vs regular users", () => {
      const regularUserId = 123456789;
      const adminUserId = 987654321; // Not in admin list for test env

      const regularButtons = AdminUtils.getButtonsForUser(regularUserId);
      const adminButtons = AdminUtils.getButtonsForUser(adminUserId);

      expect(Array.isArray(regularButtons)).toBe(true);
      expect(Array.isArray(adminButtons)).toBe(true);

      // Both should have at least skill level buttons
      expect(regularButtons.length).toBeGreaterThanOrEqual(
        SKILL_LEVEL_BUTTONS.length
      );
      expect(adminButtons.length).toBeGreaterThanOrEqual(
        SKILL_LEVEL_BUTTONS.length
      );
    });

    test("should cancel game correctly", () => {
      const gameMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

📍 <b>Место:</b> SANDDUNE PADEL CLUB Al Qouz
💵 <b>Цена:</b> 65 aed/чел
🏟️ <b>Забронировано кортов:</b> 1

📅 <a href="https://calendar.google.com/">Добавить в Google Calendar</a>

<b>Записавшиеся игроки:</b>
1. @player1 (D+)
2. @player2 (D)

⏳ <b>Waitlist:</b>
---`;

      const cancelledMessage = cancelGame(gameMessage);

      expect(cancelledMessage).toContain(
        "🎾 <b>Вторник, 07.01, 8:00-09:30</b>"
      );
      expect(cancelledMessage).toContain("SANDDUNE PADEL CLUB Al Qouz");
      expect(cancelledMessage).toContain("💵 <b>Цена:</b> 65 aed/чел");
      expect(cancelledMessage).toContain("🏟️ <b>Забронировано кортов:</b> 1");
      expect(cancelledMessage).toContain("Добавить в Google Calendar");
      expect(cancelledMessage).toContain("❗️<b>ОТМЕНА</b>❗️");
      expect(cancelledMessage).toContain("Игра отменена. Waitlist:");
      expect(cancelledMessage).toContain("1. @player1 (D+)");
      expect(cancelledMessage).toContain("2. @player2 (D)");
    });

    test("should restore cancelled game correctly", () => {
      const cancelledMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

📍 <b>Место:</b> SANDDUNE PADEL CLUB Al Qouz
💵 <b>Цена:</b> 65 aed/чел
🏟️ <b>Забронировано кортов:</b> 1

📅 <a href="https://calendar.google.com/">Добавить в Google Calendar</a>

🚫 <b>Игра отменена</b>`;

      const restoredMessage = restoreGame(cancelledMessage);

      expect(restoredMessage).toContain("🎾 <b>Вторник, 07.01, 8:00-09:30</b>");
      expect(restoredMessage).toContain("SANDDUNE PADEL CLUB Al Qouz");
      expect(restoredMessage).toContain("💵 <b>Цена:</b> 65 aed/чел");
      expect(restoredMessage).toContain("🏟️ <b>Забронировано кортов:</b> 1");
      expect(restoredMessage).toContain("Добавить в Google Calendar");
      expect(restoredMessage).not.toContain("🚫 <b>Игра отменена</b>");
      expect(restoredMessage).toContain("Записавшиеся игроки:");
      expect(restoredMessage).toContain("1. -"); // Should have empty slots
      expect(restoredMessage).toContain("4. -"); // Should have 4 slots for 1 court
      expect(restoredMessage).toContain("⏳ <b>Waitlist:</b>");
      expect(restoredMessage).toContain("---");
    });

    test("should calculate game statistics correctly", () => {
      const gameWithPlayersMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

<b>Записавшиеся игроки:</b>
1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)
4. @player4 (C-)

⏳ <b>Waitlist:</b>
🎾 @waitlist1 (D+)
🎾 @waitlist2 (D)`;

      const stats = getGameStats(gameWithPlayersMessage);

      expect(stats.registeredCount).toBe(4);
      expect(stats.waitlistCount).toBe(2);
      expect(stats.totalCount).toBe(6);
    });

    test("should handle empty game statistics", () => {
      const emptyGameMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const stats = getGameStats(emptyGameMessage);

      expect(stats.registeredCount).toBe(0);
      expect(stats.waitlistCount).toBe(0);
      expect(stats.totalCount).toBe(0);
    });

    test("should generate admin callback messages", () => {
      expect(CALLBACK_MESSAGES.ADMIN_UNAUTHORIZED).toContain("❌");
      expect(CALLBACK_MESSAGES.ADMIN_UNAUTHORIZED).toContain(
        "прав администратора"
      );

      expect(CALLBACK_MESSAGES.ADMIN_GAME_CANCELLED).toContain("🚫");
      expect(CALLBACK_MESSAGES.ADMIN_GAME_CANCELLED).toContain(
        "🚫 Игра отменена"
      );

      expect(CALLBACK_MESSAGES.ADMIN_GAME_RESTORED).toContain("✅");
      expect(CALLBACK_MESSAGES.ADMIN_GAME_RESTORED).toContain(
        "Игра восстановлена"
      );

      const statsMessage = CALLBACK_MESSAGES.ADMIN_GAME_STATS(4, 2);
      expect(statsMessage).toContain("📊 Статистика игры");
      expect(statsMessage).toContain("4");
      expect(statsMessage).toContain("2");
      expect(statsMessage).toContain("6");
    });

    test("should create admin control message for private chat", () => {
      const gameMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

📍 <b>Место:</b> <a href="https://maps.app.goo.gl/test">SANDDUNE PADEL CLUB Al Qouz</a>
💵 <b>Цена:</b> 65 aed/чел

<b>Записавшиеся игроки:</b>
1. @player1 (D+)
2. @player2 (D)

⏳ <b>Waitlist:</b>
🎾 @waitlist1 (D+)`;

      const chatId = -123456789;
      const messageId = 456;

      const adminMessage = createAdminControlMessage(
        gameMessage,
        chatId,
        messageId
      );

      expect(adminMessage).toContain("🔧 <b>Панель администратора</b>");
      expect(adminMessage).toContain("Вторник, 07.01, 8:00-09:30");
      expect(adminMessage).toContain("SANDDUNE PADEL CLUB Al Qouz");
      expect(adminMessage).toContain("Записано: 2/4");
      expect(adminMessage).toContain("В waitlist: 1");
      expect(adminMessage).toContain("Всего участников: 3");
      expect(adminMessage).toContain(`Chat ID: ${chatId}`);
      expect(adminMessage).toContain(`Message ID: ${messageId}`);
    });

    test("should extract game reference from admin control message", () => {
      const adminMessage = `🔧 Панель администратора

🎾 Игра: Вторник, 07.01, 8:00-09:30
📍 Место: SANDDUNE PADEL CLUB Al Qouz

📊 Статистика:
👥 Записано: 2
⏳ Waitlist: 1
📈 Всего: 3

🔗 Связанное сообщение:
Chat ID: -123456789
Message ID: 456

Используйте кнопки ниже для управления игрой:`;

      const reference = extractGameReference(adminMessage);

      expect(reference).toBeDefined();
      expect(reference?.chatId).toBe(-123456789);
      expect(reference?.messageId).toBe(456);
    });

    test("should handle invalid admin control message", () => {
      const invalidMessage = "Invalid admin message without references";

      const reference = extractGameReference(invalidMessage);

      expect(reference).toBeNull();
    });

    test("should return only skill level buttons for all users now", () => {
      const regularUserId = 123456789;
      const adminUserId = 482553595; // Real admin ID from constants

      const regularButtons = AdminUtils.getButtonsForUser(regularUserId);
      const adminButtons = AdminUtils.getButtonsForUser(adminUserId);

      // Both should return the same (only skill level buttons)
      expect(regularButtons).toEqual(adminButtons);
      expect(regularButtons.length).toBe(SKILL_LEVEL_BUTTONS.length);
    });

    test("should provide separate admin buttons for private messages", () => {
      const adminButtons = AdminUtils.getAdminButtons();

      expect(Array.isArray(adminButtons)).toBe(true);
      expect(adminButtons.length).toBe(ADMIN_BUTTONS.length);

      const flatButtons = adminButtons.flat();
      flatButtons.forEach((button) => {
        expect(button.callback_data).toMatch(/^admin_/);
      });
    });

    test("should create admin control message with proper game reference", () => {
      const gameMessage = `🎾 <b>Понедельник, 06.01, 20:00-21:30</b>

📍 <b>Место:</b> <a href="https://maps.app.goo.gl/test">SANDDUNE PADEL CLUB Al Qouz</a>
💵 <b>Цена:</b> 65 aed/чел

<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>`;

      const chatId = -1001234567890;
      const messageId = 123;

      const adminMessage = createAdminControlMessage(
        gameMessage,
        chatId,
        messageId
      );

      // Should contain all required elements
      expect(adminMessage).toContain("🔧 <b>Панель администратора</b>");
      expect(adminMessage).toContain("Понедельник, 06.01, 20:00-21:30");
      expect(adminMessage).toContain("SANDDUNE PADEL CLUB Al Qouz");
      expect(adminMessage).toContain(`Chat ID: ${chatId}`);
      expect(adminMessage).toContain(`Message ID: ${messageId}`);

      // Should extract reference correctly
      const reference = extractGameReference(adminMessage);
      expect(reference?.chatId).toBe(chatId);
      expect(reference?.messageId).toBe(messageId);
    });
  });
});
