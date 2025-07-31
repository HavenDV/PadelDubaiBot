import { MessageUtils } from "../src/app/lib/telegram/message-utils";
import {
  SKILL_LEVEL_BUTTONS,
  CALLBACK_MESSAGES,
  generateCalendarLinks,
} from "../src/app/lib/telegram/constants";

describe("Core Bot Functionality Tests", () => {
  describe("HTML Formatting Restoration (Critical Feature)", () => {
    test("should restore HTML bold tags in message headers and labels", () => {
      const messageWithoutHTML = `🎾 Вторник, 07.01, 8:00-09:30

📍 Место: SANDDUNE PADEL CLUB Al Qouz
💵 Цена: 65 aed/чел
🏟️ Забронировано кортов: 2

Записавшиеся игроки:

⏳ Waitlist:
_Пусто_`;

      const result = MessageUtils.updateMessageWithUserSelection(
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

      const result = MessageUtils.updateMessageWithUserSelection(
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

      const result = MessageUtils.updateMessageWithUserSelection(
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

      const result = MessageUtils.updateMessageWithUserSelection(
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
_Пусто_`;

      const result = MessageUtils.updateMessageWithUserSelection(
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
_Пусто_`;

      // Add 3 players
      for (let i = 1; i <= 3; i++) {
        const result = MessageUtils.updateMessageWithUserSelection(
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
      const result = MessageUtils.updateMessageWithUserSelection(
        `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
_Пусто_`,
        "@player",
        "D"
      );

      expect(result.updatedMessage).toContain("⏳ <b>Waitlist:</b>");
      expect(result.updatedMessage).toContain("_Пусто_");
    });

    test("should handle player cancellation from main list", () => {
      const gameWithPlayers = `<b>Записавшиеся игроки:</b>

1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)

⏳ <b>Waitlist:</b>
_Пусто_`;

      // Cancel player2
      const result = MessageUtils.updateMessageWithUserSelection(
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
        day: "Вторник",
        date: "07.01",
        time: "8:00-09:30",
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
          const result = MessageUtils.updateMessageWithUserSelection(
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
      const result = MessageUtils.updateMessageWithUserSelection("", "", "");
      expect(result.updatedMessage).toBeDefined();
      expect(typeof result.updatedMessage).toBe("string");
    });

    test("should handle special characters in usernames", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
_Пусто_`;

      const specialUsernames = [
        "@тест_user",
        "@user-with-dashes",
        "@user.with.dots",
        "@user123",
        "@مستخدم",
      ];

      specialUsernames.forEach((username) => {
        const result = MessageUtils.updateMessageWithUserSelection(
          message,
          username,
          "D+"
        );
        expect(result.updatedMessage).toContain(username);
      });
    });
  });

  describe("Performance Requirements", () => {
    test("should process messages efficiently", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
_Пусто_`;

      const startTime = Date.now();

      // Process 50 registrations
      for (let i = 0; i < 50; i++) {
        MessageUtils.updateMessageWithUserSelection(message, `@user${i}`, "D+");
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
_Пусто_`;

      const startTime = Date.now();

      // Apply HTML restoration 25 times
      for (let i = 0; i < 25; i++) {
        MessageUtils.updateMessageWithUserSelection(
          messageWithoutHTML,
          `@user${i}`,
          "D+"
        );
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
_Пусто_`;

    test("should parse game time correctly", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const day = tomorrow.getDate().toString().padStart(2, "0");
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");

      const gameMessage = mockGameMessage(day, month, "08");
      const hoursUntil = MessageUtils.getHoursUntilGame(gameMessage);

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
      const cancellationCheck = MessageUtils.isLateCancellation(gameMessage);

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

      const hoursUntil = MessageUtils.getHoursUntilGame(invalidMessage);
      const cancellationCheck = MessageUtils.isLateCancellation(invalidMessage);

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
        expect(MessageUtils.normalizeName(input)).toBe(expected);
      });
    });
  });
});
