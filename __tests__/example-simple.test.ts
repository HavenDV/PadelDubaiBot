import { GameDataManager } from "../src/app/lib/telegram/game-data";
import { MessageFormatter } from "../src/app/lib/telegram/message-formatter";
import type { PlayerAction } from "../src/app/lib/telegram/types";
import {
  SKILL_LEVEL_BUTTONS,
  WELCOME_MESSAGE_TEMPLATE,
  generateCalendarLinks,
} from "../src/app/lib/telegram/constants";

// Helper function to replace updateMessageWithUserSelection
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

describe("Example Tests - Simple Working Tests", () => {
  describe("HTML Formatting Restoration", () => {
    test("should restore bold formatting in message", () => {
      const messageWithoutHTML = `🎾 Вторник, 07.01, 8:00-09:30

📍 Место: SANDDUNE PADEL CLUB Al Qouz
💵 Цена: 65 aed/чел

Записавшиеся игроки:

⏳ Waitlist:
---`;

      const result = updateMessageWithUserSelection(
        messageWithoutHTML,
        "@testuser",
        "D+"
      );

      // Verify HTML tags are restored
      expect(result.updatedMessage).toContain("<b>");
      expect(result.updatedMessage).toContain("</b>");
      expect(result.updatedMessage).toContain("@testuser (D+)");
    });

    test("should restore map links for known clubs", () => {
      const message = `📍 Место: SANDDUNE PADEL CLUB Al Qouz

Записавшиеся игроки:`;

      const result = updateMessageWithUserSelection(message, "@player", "D");

      expect(result.updatedMessage).toContain("maps.app.goo.gl");
      expect(result.updatedMessage).toContain("<a href=");
    });
  });

  describe("Player Registration", () => {
    test("should add player to main list when space available", () => {
      const emptyGameMessage = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const result = updateMessageWithUserSelection(
        emptyGameMessage,
        "@newplayer",
        "D+"
      );

      expect(result.updatedMessage).toContain("1. @newplayer (D+)");
      expect(result.notification).toBeUndefined();
    });

    test("should handle registration without promotion notification", () => {
      const gameWithPlayers = `<b>Записавшиеся игроки:</b>

1. @player1 (D+)
2. @player2 (D)

⏳ <b>Waitlist:</b>
---`;

      const result = updateMessageWithUserSelection(
        gameWithPlayers,
        "@player3",
        "C-"
      );

      expect(result.updatedMessage).toContain("@player3 (C-)");
      expect(result.notification).toBeUndefined();
    });
  });

  describe("Constants and Helpers", () => {
    test("should have correct skill level buttons", () => {
      expect(SKILL_LEVEL_BUTTONS).toBeDefined();
      expect(Array.isArray(SKILL_LEVEL_BUTTONS)).toBe(true);

      // Should have skill level buttons (note: actual implementation has 3 rows)
      const flatButtons = SKILL_LEVEL_BUTTONS.flat();
      const skillButtons = flatButtons.filter((btn) =>
        btn.callback_data?.startsWith("skill_")
      );

      expect(skillButtons.length).toBeGreaterThanOrEqual(6); // E, D, D+, C-, C, C+
    });

    test("should generate valid calendar links", () => {
      const gameInfo = {
        startTime: new Date(2025, 0, 7, 8, 0), // January 7, 2025, 8:00 AM
        endTime: new Date(2025, 0, 7, 9, 30), // January 7, 2025, 9:30 AM
        club: "Test Club",
      };

      const result = generateCalendarLinks(gameInfo);

      expect(result.google).toContain("calendar.google.com");
      expect(result.google).toContain("action=TEMPLATE");
      expect(result.google).toContain("text=");
    });
  });

  describe("Edge Cases", () => {
    test("should handle malformed messages gracefully", () => {
      const malformedMessage = "Invalid message format";

      const result = updateMessageWithUserSelection(
        malformedMessage,
        "@testuser",
        "D+"
      );

      // Should not crash and return some result
      expect(result.updatedMessage).toBeDefined();
      expect(typeof result.updatedMessage).toBe("string");
    });

    test("should handle empty inputs", () => {
      const result = updateMessageWithUserSelection("", "", "");

      expect(result.updatedMessage).toBeDefined();
    });

    test("should handle special characters in usernames", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const result = updateMessageWithUserSelection(
        message,
        "@тест_пользователь",
        "D+"
      );

      expect(result.updatedMessage).toContain("@тест_пользователь");
    });
  });

  describe("Performance", () => {
    test("should handle message updates efficiently", () => {
      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const startTime = Date.now();

      // Run 100 updates
      for (let i = 0; i < 100; i++) {
        updateMessageWithUserSelection(message, `@user${i}`, "D+");
      }

      const duration = Date.now() - startTime;

      // Should complete 100 updates in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Welcome Message", () => {
    test("should generate welcome message with player name", () => {
      const playerName = "Елизавета";
      const welcomeMessage = WELCOME_MESSAGE_TEMPLATE(playerName);

      expect(welcomeMessage).toContain(`Привет ${playerName} 🎾!`);
      expect(welcomeMessage).toContain("Добро пожаловать в наш padel чат!");
      expect(welcomeMessage).toContain("До встречи на корте! 🏆");
    });
  });
});
