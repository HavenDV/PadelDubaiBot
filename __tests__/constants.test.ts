import {
  SKILL_LEVEL_BUTTONS,
  CLUB_LOCATIONS,
  generateCalendarLinks,
  GAME_MESSAGE_TEMPLATE,
  WEEKLY_SCHEDULE_TEMPLATE,
} from "../src/app/lib/telegram/constants";

describe("Telegram Constants and Helpers", () => {
  describe("SKILL_LEVEL_BUTTONS", () => {
    test("should have correct button structure", () => {
      expect(SKILL_LEVEL_BUTTONS).toBeDefined();
      expect(Array.isArray(SKILL_LEVEL_BUTTONS)).toBe(true);

      // Flatten the button rows and check for skill buttons
      const flatButtons = SKILL_LEVEL_BUTTONS.flat();
      const skillButtons = flatButtons.filter(
        (btn) => btn.callback_data && btn.callback_data.startsWith("skill_")
      );

      // Should have exactly 7 buttons (6 skill levels + 1 cancel)
      expect(skillButtons.length).toBe(7);

      // Check specific skill levels exist
      const skillTexts = skillButtons.map((btn) => btn.text);
      expect(skillTexts.some((text) => text.includes("E ("))).toBe(true);
      expect(skillTexts.some((text) => text.includes("D ("))).toBe(true);
      expect(skillTexts.some((text) => text.includes("D+ ("))).toBe(true);
      expect(skillTexts.some((text) => text.includes("C- ("))).toBe(true);
      expect(skillTexts.some((text) => text.includes("C ("))).toBe(true);
      expect(skillTexts.some((text) => text.includes("C+ ("))).toBe(true);
    });

    test("should have proper callback data format for skill buttons", () => {
      const flatButtons = SKILL_LEVEL_BUTTONS.flat();
      const skillButtons = flatButtons.filter(
        (btn) =>
          btn.callback_data &&
          btn.callback_data.startsWith("skill_") &&
          btn.callback_data !== "skill_not_coming" // Exclude the cancel button
      );

      skillButtons.forEach((button) => {
        // Allow for regular skill levels (E, D, D+, C-, C, C+)
        expect(button.callback_data).toMatch(/^skill_([EDC][+-]?)$/);
      });
    });

    test("should include cancel button", () => {
      const flatButtons = SKILL_LEVEL_BUTTONS.flat();
      const cancelButton = flatButtons.find(
        (btn) => btn.callback_data === "skill_not_coming"
      );

      expect(cancelButton).toBeDefined();
      expect(cancelButton?.text).toContain("❌");
    });
  });

  describe("CLUB_LOCATIONS", () => {
    test("should have both clubs with valid URLs", () => {
      expect(CLUB_LOCATIONS).toHaveProperty("SANDDUNE PADEL CLUB Al Qouz");
      expect(CLUB_LOCATIONS).toHaveProperty("Oxygen Padel Sport Academy");

      expect(CLUB_LOCATIONS["SANDDUNE PADEL CLUB Al Qouz"]).toContain(
        "maps.app.goo.gl"
      );
      expect(CLUB_LOCATIONS["Oxygen Padel Sport Academy"]).toContain(
        "maps.app.goo.gl"
      );
    });

    test("should have properly formatted map URLs", () => {
      Object.values(CLUB_LOCATIONS).forEach((url) => {
        expect(url).toMatch(/^https:\/\/maps\.app\.goo\.gl\//);
        expect(url).toContain("?g_st=ipc");
      });
    });
  });

  describe("generateCalendarLinks", () => {
    const gameInfo = {
      day: "Вторник",
      date: "07.01",
      time: "8:00-09:30",
      club: "SANDDUNE PADEL CLUB Al Qouz",
    };

    test("should generate valid Google Calendar URL", () => {
      const result = generateCalendarLinks(gameInfo);

      expect(result.google).toContain("calendar.google.com/calendar/render");
      expect(result.google).toContain("action=TEMPLATE");
      expect(result.google).toContain(
        "text=Padel%20-%20SANDDUNE%20PADEL%20CLUB%20Al%20Qouz"
      );
      expect(result.google).toContain("dates=");
      expect(result.google).toContain("location=");
    });

    test("should handle time conversion correctly", () => {
      const result = generateCalendarLinks(gameInfo);

      // Should contain UTC time conversion
      expect(result.google).toMatch(/\d{8}T\d{6}Z/);
    });

    test("should encode special characters properly", () => {
      const gameInfoWithSpecialChars = {
        ...gameInfo,
        club: "Test Club & Location",
      };

      const result = generateCalendarLinks(gameInfoWithSpecialChars);

      expect(result.google).toContain("%26"); // & encoded
    });
  });

  describe("GAME_MESSAGE_TEMPLATE", () => {
    const gameInfo = {
      day: "Вторник",
      date: "07.01",
      time: "8:00-09:30",
      club: "SANDDUNE PADEL CLUB Al Qouz",
      price: "65 aed/чел",
      courts: 2,
    };

    test("should generate complete message with all elements", () => {
      const message = GAME_MESSAGE_TEMPLATE(gameInfo);

      expect(message).toContain("🎾");
      expect(message).toContain("Вторник, 07.01, 8:00-09:30");
      expect(message).toContain("📍");
      expect(message).toContain("💵");
      expect(message).toContain("65 aed/чел");
      expect(message).toContain("🏟️");
      expect(message).toContain("2");
      expect(message).toContain("📅");
      expect(message).toContain("Записавшиеся игроки:");
    });

    test("should include map and calendar links", () => {
      const message = GAME_MESSAGE_TEMPLATE(gameInfo);

      expect(message).toContain('<a href="https://maps.app.goo.gl/');
      expect(message).toContain('<a href="https://calendar.google.com/');
    });

    test("should handle cancelled games", () => {
      const cancelledGame = {
        ...gameInfo,
        cancelled: true,
      };

      const message = GAME_MESSAGE_TEMPLATE(cancelledGame);

      expect(message).toContain("ОТМЕНА");
      expect(message).toContain("Игра отменена. Waitlist:");
    });
  });

  describe("WEEKLY_SCHEDULE_TEMPLATE", () => {
    test("should contain proper header", () => {
      expect(WEEKLY_SCHEDULE_TEMPLATE).toContain("Расписание Padel");
      expect(WEEKLY_SCHEDULE_TEMPLATE).toContain("следующую неделю");
    });

    test("should not contain deprecated text", () => {
      expect(WEEKLY_SCHEDULE_TEMPLATE).not.toContain("на неделю");
      expect(WEEKLY_SCHEDULE_TEMPLATE).not.toContain("на эту неделю");
    });

    test("should have proper formatting", () => {
      expect(WEEKLY_SCHEDULE_TEMPLATE).toContain("🏓");
      expect(WEEKLY_SCHEDULE_TEMPLATE).toContain("<b>");
    });
  });
});
