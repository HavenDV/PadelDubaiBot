import { GameDataManager } from "../src/app/lib/telegram/game-data";
import { MessageFormatter } from "../src/app/lib/telegram/message-formatter";
import { CALLBACK_MESSAGES } from "../src/app/lib/telegram/constants";
import type { PlayerAction } from "../src/app/lib/telegram/types";

// Helper function to simulate user selection (replaces updateMessageWithUserSelection)
function updateMessageWithUserSelection(
  currentText: string,
  displayName: string,
  selectedLevel: string
): { updatedMessage: string; notification?: string } {
  const gameInfo = GameDataManager.parseGameDataFromMessage(currentText);
  if (!gameInfo) {
    return { updatedMessage: currentText };
  }

  // Generate a simple hash for user ID from display name (same as deprecated method)
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

describe("Integration Tests - Complete Workflows", () => {
  describe("HTML Restoration and Player Registration Workflow", () => {
    test("should handle complete user registration workflow with HTML restoration", () => {
      // Start with message as received from Telegram webhook (without HTML)
      const messageFromTelegram = `🎾 Вторник, 07.01, 8:00-09:30

📍 Место: SANDDUNE PADEL CLUB Al Qouz
💵 Цена: 65 aed/чел
🏟️ Забронировано кортов: 2

📅 Добавить в Google Calendar

Записавшиеся игроки:

⏳ Waitlist:
---`;

      // Test first player registration
      const result1 = updateMessageWithUserSelection(
        messageFromTelegram,
        "@player1",
        "D+"
      );

      // Verify HTML restoration happened
      expect(result1.updatedMessage).toContain(
        "<b>Вторник, 07.01, 8:00-09:30</b>"
      );
      expect(result1.updatedMessage).toContain("📍 <b>Место:</b>");
      expect(result1.updatedMessage).toContain("maps.app.goo.gl");
      expect(result1.updatedMessage).toContain("calendar.google.com");
      expect(result1.updatedMessage).toContain("@player1 (D+)");
      expect(result1.notification).toBeUndefined();

      // Test filling up the main list
      let currentMessage = result1.updatedMessage;

      for (let i = 2; i <= 4; i++) {
        const result = updateMessageWithUserSelection(
          currentMessage,
          `@player${i}`,
          "D"
        );
        currentMessage = result.updatedMessage;
        expect(result.notification).toBeUndefined();
      }

      // Verify main list is full
      expect(currentMessage).toContain("@player4 (D)");

      // Test waitlist registration (5th player)
      const waitlistResult = updateMessageWithUserSelection(
        currentMessage,
        "@waitlist1",
        "D+"
      );

      expect(waitlistResult.updatedMessage).toContain("5. @waitlist1 (D+)");
      // Waitlist should be empty now
      expect(waitlistResult.updatedMessage).toContain(
        "⏳ <b>Waitlist:</b>\n---"
      );
      expect(waitlistResult.notification).toBeUndefined();

      // Verify HTML formatting is preserved throughout
      expect(waitlistResult.updatedMessage).toContain("<b>");
      expect(waitlistResult.updatedMessage).toContain("maps.app.goo.gl");
      expect(waitlistResult.updatedMessage).toContain("calendar.google.com");
    });

    test("should handle promotion and notification workflow", () => {
      // Start with a full game plus waitlist
      const fullGameMessage = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>

📍 <b>Место:</b> <a href="https://maps.app.goo.gl/test">SANDDUNE PADEL CLUB Al Qouz</a>
💵 <b>Цена:</b> 65 aed/чел

<b>Записавшиеся игроки:</b>

1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)
4. @player4 (C-)

⏳ <b>Waitlist:</b>
1. @waitlist1 (D+)
2. @waitlist2 (D)
3. @waitlist3 (D+)`;

      // Test cancellation with promotion
      const result = updateMessageWithUserSelection(
        fullGameMessage,
        "@player2",
        "D" // Same skill level = cancellation
      );

      // Verify promotion happened
      expect(result.updatedMessage).not.toContain("2. @player2 (D)");
      expect(result.updatedMessage).toContain("@waitlist1 (D+)");

      // Verify notification was generated
      expect(result.notification).toBeDefined();
      expect(result.notification).toContain("@player2 отменил участие");
      expect(result.notification).toContain(
        "@waitlist1 переходит в основной состав"
      );
    });

    test("should handle waitlist cancellation without promotion", () => {
      const messageWithWaitlist = `<b>Записавшиеся игроки:</b>

1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)
4. @player4 (C-)

⏳ <b>Waitlist:</b>
1. @waitlist1 (D+)
2. @waitlist2 (D)
3. @waitlist3 (D+)`;

      const result = updateMessageWithUserSelection(
        messageWithWaitlist,
        "@waitlist2",
        "D" // Same skill level = cancellation
      );

      // Player should be removed from waitlist
      expect(result.updatedMessage).not.toContain("3. @waitlist2 (D)");
      expect(result.updatedMessage).toContain("1. @waitlist1 (D+)");
      expect(result.updatedMessage).toContain("2. @waitlist3 (D+)");

      // No notification for waitlist cancellation
      expect(result.notification).toBeUndefined();
    });
  });

  describe("Performance Tests", () => {
    test("should handle multiple registrations efficiently", () => {
      const baseMessage = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      const startTime = Date.now();

      let currentMessage = baseMessage;

      // Simulate 20 player registrations
      for (let i = 1; i <= 20; i++) {
        const result = updateMessageWithUserSelection(
          currentMessage,
          `@player${i}`,
          "D+"
        );
        currentMessage = result.updatedMessage;
      }

      const duration = Date.now() - startTime;

      // Should handle 20 registrations in under 50ms
      expect(duration).toBeLessThan(50);

      // Verify final state
      expect(currentMessage).toContain("@player1 (D+)");
      expect(currentMessage).toContain("16. @player20 (D+)"); // In waitlist
    });

    test("should handle HTML restoration repeatedly without performance degradation", () => {
      const messageWithoutHTML = `🎾 Вторник, 07.01, 8:00-09:30
📍 Место: SANDDUNE PADEL CLUB Al Qouz
Записавшиеся игроки:
⏳ Waitlist:
---`;

      const startTime = Date.now();

      // Apply HTML restoration 100 times
      for (let i = 0; i < 100; i++) {
        updateMessageWithUserSelection(messageWithoutHTML, `@user${i}`, "D+");
      }

      const duration = Date.now() - startTime;

      // Should complete 100 restorations in under 200ms
      expect(duration).toBeLessThan(200);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle various malformed messages", () => {
      const malformedMessages = [
        "",
        "Invalid message",
        "🎾 Incomplete\nNo structure",
        "Записавшиеся игроки:\nNo waitlist section",
        "Random text with some emojis 🎾 📍",
      ];

      malformedMessages.forEach((message, index) => {
        expect(() => {
          const result = updateMessageWithUserSelection(
            message,
            `@testuser${index}`,
            "D+"
          );
          expect(result.updatedMessage).toBeDefined();
        }).not.toThrow();
      });
    });

    test("should handle special characters and emojis in usernames", () => {
      const specialUsernames = [
        "@тест_user",
        "@user-with-dashes",
        "@user.with.dots",
        "@user123",
        "@user_🎾_emoji",
        "@مستخدم_عربي",
      ];

      const message = `<b>Записавшиеся игроки:</b>

⏳ <b>Waitlist:</b>
---`;

      specialUsernames.forEach((username) => {
        const result = updateMessageWithUserSelection(message, username, "D+");

        expect(result.updatedMessage).toContain(username);
      });
    });
  });

  describe("Penalty System Integration", () => {
    test("should integrate penalty system with complete workflow", () => {
      // Create a game for tomorrow (within 24 hours)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const day = tomorrow.getDate().toString().padStart(2, "0");
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");

      const gameMessage = `🎾 <b>Вторник, ${day}.${month}, 08:00-09:30</b>

📍 <b>Место:</b> <a href="https://maps.app.goo.gl/test">SANDDUNE PADEL CLUB Al Qouz</a>
💵 <b>Цена:</b> 65 aed/чел
🏟️ <b>Забронировано кортов:</b> 2

📅 <a href="https://calendar.google.com/test">Добавить в Google Calendar</a>

<b>Записавшиеся игроки:</b>

1. @player1 (D+)

⏳ <b>Waitlist:</b>
---`;

      // Test penalty detection
      const lateCancellationCheck = (() => {
        const gameInfo = GameDataManager.parseGameDataFromMessage(gameMessage);
        return gameInfo
          ? GameDataManager.isLateCancellation(gameInfo)
          : { isLate: false, hoursRemaining: null };
      })();

      expect(lateCancellationCheck.isLate).toBeDefined();
      expect(lateCancellationCheck.hoursRemaining).not.toBeNull();

      // Test penalty message generation
      if (lateCancellationCheck.hoursRemaining !== null) {
        const penaltyMessage = CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(
          lateCancellationCheck.hoursRemaining
        );

        expect(penaltyMessage).toContain("⚠️ ВНИМАНИЕ!");
        expect(penaltyMessage).toContain("штрафные санкции");
      }
    });
  });
});
