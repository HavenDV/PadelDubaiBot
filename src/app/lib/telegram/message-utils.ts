// Message formatting utilities

export interface UserRegistration {
  userName: string;
  skillLevel: string;
}

export class MessageUtils {
  /**
   * Restores HTML formatting that might be lost in Telegram webhook
   */
  private static restoreHTMLFormatting(text: string): string {
    // Only restore formatting if it's not already present
    let formattedText = text;

    // Restore title formatting (only if not already bold)
    if (!formattedText.includes("🎾 <b>")) {
      formattedText = formattedText.replace(/^🎾 (.+)$/gm, "🎾 <b>$1</b>");
    }

    // Restore field labels (only if not already bold)
    if (!formattedText.includes("📍 <b>Место:</b>")) {
      formattedText = formattedText.replace(/📍 Место:/g, "📍 <b>Место:</b>");
    }
    if (!formattedText.includes("💵 <b>Цена:</b>")) {
      formattedText = formattedText.replace(/💵 Цена:/g, "💵 <b>Цена:</b>");
    }
    if (!formattedText.includes("🏟️ <b>Забронировано кортов:</b>")) {
      formattedText = formattedText.replace(
        /🏟️ Забронировано кортов:/g,
        "🏟️ <b>Забронировано кортов:</b>"
      );
    }
    if (!formattedText.includes("<b>Записавшиеся игроки:</b>")) {
      formattedText = formattedText.replace(
        /Записавшиеся игроки:/g,
        "<b>Записавшиеся игроки:</b>"
      );
    }
    if (!formattedText.includes("<b>Игра отменена. Waitlist:</b>")) {
      formattedText = formattedText.replace(
        /Игра отменена\. Waitlist:/g,
        "<b>Игра отменена. Waitlist:</b>"
      );
    }
    if (!formattedText.includes("⏳ <b>Waitlist:</b>")) {
      formattedText = formattedText.replace(
        /⏳ Waitlist:/g,
        "⏳ <b>Waitlist:</b>"
      );
    }
    if (!formattedText.includes("❗️<b>ОТМЕНА</b>❗️")) {
      formattedText = formattedText.replace(
        /❗️ОТМЕНА❗️/g,
        "❗️<b>ОТМЕНА</b>❗️"
      );
    }

    // Try to restore map links if we can detect the club name
    if (
      formattedText.includes("SANDDUNE PADEL CLUB Al Qouz") &&
      !formattedText.includes("<a href=")
    ) {
      formattedText = formattedText.replace(
        "SANDDUNE PADEL CLUB Al Qouz",
        '<a href="https://maps.app.goo.gl/GZgQCpsX1uyvFwLB7?g_st=ipc">SANDDUNE PADEL CLUB Al Qouz</a>'
      );
    }

    if (
      formattedText.includes("Oxygen Padel Sport Academy") &&
      !formattedText.includes("<a href=")
    ) {
      formattedText = formattedText.replace(
        "Oxygen Padel Sport Academy",
        '<a href="https://maps.app.goo.gl/cH1EZrrpbuYVWsMY6?g_st=ipc">Oxygen Padel Sport Academy</a>'
      );
    }

    // Try to restore calendar link if missing
    if (
      formattedText.includes("Добавить в Google Calendar") &&
      !formattedText.includes("calendar.google.com")
    ) {
      // Extract date and time for calendar link
      const dateTimeMatch = formattedText.match(
        /🎾[\s\S]*?(\d{2}\.\d{2})[\s\S]*?(\d{1,2}:\d{2}-\d{1,2}:\d{2})/
      );
      const clubMatch = formattedText.match(
        /📍[\s\S]*?>(.*?)<\/a>|📍[\s\S]*?:\s*(.+?)(?=\n|💵)/
      );

      if (dateTimeMatch && clubMatch) {
        const [, ,] = dateTimeMatch;
        let club = (clubMatch[1] || clubMatch[2] || "").trim();

        // Clean up club name - extract just the club name
        if (club.includes("SANDDUNE PADEL CLUB")) {
          club = "SANDDUNE PADEL CLUB Al Qouz";
        } else if (club.includes("Oxygen Padel")) {
          club = "Oxygen Padel Sport Academy";
        } else {
          // Remove HTML tags if any
          club = club.replace(/<[^>]*>/g, "").trim();
        }

        // Generate a basic calendar link
        const title = encodeURIComponent(`Padel - ${club}`);
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`;

        formattedText = formattedText.replace(
          "Добавить в Google Calendar",
          `<a href="${calendarUrl}">Добавить в Google Calendar</a>`
        );
      } else {
        // Fallback: create a basic calendar link
        const title = encodeURIComponent("Padel Game");
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`;

        formattedText = formattedText.replace(
          "Добавить в Google Calendar",
          `<a href="${calendarUrl}">Добавить в Google Calendar</a>`
        );
      }
    }

    return formattedText;
  }

  /**
   * Updates a padel game message by adding or updating user registrations
   */
  static updateMessageWithUserSelection(
    currentText: string,
    displayName: string,
    skillLevel: string
  ): { updatedMessage: string; notification?: string } {
    // Split the message into parts
    const lines = currentText.split("\n");

    // Find where the player list starts (after the calendar link)
    let baseMessageEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].includes("Записавшиеся игроки:") ||
        lines[i].includes("Игра отменена. Waitlist:")
      ) {
        baseMessageEndIndex = i;
        break;
      }
    }

    if (baseMessageEndIndex === -1) {
      return { updatedMessage: currentText }; // Fallback if message format is unexpected
    }

    // Get the base message part (everything up to and including the "Записавшиеся игроки:" line)
    let baseMessage = lines.slice(0, baseMessageEndIndex + 1).join("\n");

    // Restore HTML formatting that might have been lost in Telegram webhook
    baseMessage = this.restoreHTMLFormatting(baseMessage);

    // Parse existing registrations and waitlist
    const { registrations, waitlist } = this.parseRegistrationsAndWaitlist(
      lines,
      baseMessageEndIndex
    );

    const key = this.normalizeName(displayName);
    let notification: string | undefined;

    // Handle user selection
    const wasInMain = registrations.has(key);
    const wasInWaitlist = waitlist.has(key);

    // Check if this is a cancellation (either explicit "not_coming" or clicking the same skill level again)
    const isExplicitCancellation = skillLevel === "not_coming";
    const isSameSkillCancellation =
      (wasInMain && registrations.get(key)?.level === skillLevel) ||
      (wasInWaitlist && waitlist.get(key)?.level === skillLevel);

    if (isExplicitCancellation || isSameSkillCancellation) {
      // User is canceling
      if (wasInMain) {
        registrations.delete(key);

        // Move first waitlist player to main game
        if (waitlist.size > 0) {
          const firstWaitlistEntry = waitlist.entries().next().value;
          if (firstWaitlistEntry) {
            const [waitlistKey, waitlistPlayer] = firstWaitlistEntry;
            waitlist.delete(waitlistKey);
            registrations.set(waitlistKey, waitlistPlayer);

            notification = `🔄 ${displayName} отменил участие, ${waitlistPlayer.displayName} переходит в основной состав с Waitlist!`;
          } else {
            notification = `❌ ${displayName} отменил участие`;
          }
        } else {
          notification = `❌ ${displayName} отменил участие`;
        }
      } else if (wasInWaitlist) {
        waitlist.delete(key);
        // No notification for waitlist cancellation
      }
    } else {
      // User is registering
      if (wasInMain || wasInWaitlist) {
        // Update existing registration with new skill level
        if (wasInMain) {
          registrations.set(key, { displayName, level: skillLevel });
        } else {
          waitlist.set(key, { displayName, level: skillLevel });
        }
      } else {
        // New registration
        if (registrations.size < 4) {
          registrations.set(key, { displayName, level: skillLevel });
        } else {
          waitlist.set(key, { displayName, level: skillLevel });
        }
      }
    }

    // Build the updated message
    const updatedMessage = this.buildUpdatedMessageWithWaitlist(
      baseMessage,
      registrations,
      waitlist
    );

    return { updatedMessage, notification };
  }

  /**
   * Parses existing user registrations and waitlist from message lines
   */
  private static parseRegistrationsAndWaitlist(
    lines: string[],
    baseMessageEndIndex: number
  ): {
    registrations: Map<string, { displayName: string; level: string }>;
    waitlist: Map<string, { displayName: string; level: string }>;
  } {
    const registrations = new Map<
      string,
      { displayName: string; level: string }
    >();
    const waitlist = new Map<string, { displayName: string; level: string }>();

    const existingLines = lines.slice(baseMessageEndIndex + 1);
    let inWaitlist = false;

    // Parse existing registrations and waitlist
    for (const line of existingLines) {
      if (line.trim()) {
        // Check if we've reached the waitlist section
        if (line.includes("Waitlist:")) {
          inWaitlist = true;
          continue;
        }

        // Match patterns like "1. Name (D+)" or "🎾 @nick (D+)"
        const levelMatch = line.match(/^(?:\d+\.\s+|🎾\s*)?(.+?)\s*\((.+?)\)$/);
        if (levelMatch) {
          const [, rawName, level] = levelMatch;
          const key = this.normalizeName(rawName.trim());
          const playerData = {
            displayName: rawName.trim(),
            level: level.trim(),
          };

          if (inWaitlist) {
            waitlist.set(key, playerData);
          } else {
            registrations.set(key, playerData);
          }
        }
      }
    }

    return { registrations, waitlist };
  }

  /**
   * Legacy method for backward compatibility
   */
  private static parseExistingRegistrations(
    lines: string[],
    baseMessageEndIndex: number
  ): Map<string, { displayName: string; level: string }> {
    const { registrations } = this.parseRegistrationsAndWaitlist(
      lines,
      baseMessageEndIndex
    );
    return registrations;
  }

  /** Normalizes a display name to a unique key (prefer username without @) */
  static normalizeName(name: string): string {
    // If anchor markup: extract username part
    const anchorMatch = name.match(/<a[^>]+\/([^"'>]+)"[^>]*>/);
    if (anchorMatch) return anchorMatch[1].toLowerCase();

    // If @mention
    const mentionMatch = name.match(/^@([A-Za-z0-9_]+)/);
    if (mentionMatch) return mentionMatch[1].toLowerCase();

    // Fallback: strip HTML tags and return lowercase text
    return name.replace(/<[^>]+>/g, "").toLowerCase();
  }

  /**
   * Builds the updated message with user registrations and waitlist
   */
  private static buildUpdatedMessageWithWaitlist(
    baseMessage: string,
    registrations: Map<string, { displayName: string; level: string }>,
    waitlist: Map<string, { displayName: string; level: string }>
  ): string {
    let updatedMessage = baseMessage;

    // Add main players (max 4)
    if (registrations.size > 0) {
      updatedMessage += "\n";
      let counter = 1;
      for (const { displayName, level } of registrations.values()) {
        updatedMessage += `\n${counter}. ${displayName} (${level})`;
        counter++;
      }
    }

    // Add waitlist section (always show, even if empty)
    updatedMessage += "\n\n⏳ <b>Waitlist:</b>";
    if (waitlist.size > 0) {
      for (const { displayName, level } of waitlist.values()) {
        updatedMessage += `\n🎾 ${displayName} (${level})`;
      }
    } else {
      updatedMessage += "\n_Пусто_";
    }

    return updatedMessage;
  }

  /**
   * Legacy method for backward compatibility
   */
  private static buildUpdatedMessage(
    baseMessage: string,
    registrations: Map<string, { displayName: string; level: string }>
  ): string {
    return this.buildUpdatedMessageWithWaitlist(
      baseMessage,
      registrations,
      new Map()
    );
  }

  /**
   * Gets all registered users from a message
   */
  static getRegisteredUsers(messageText: string): UserRegistration[] {
    const lines = messageText.split("\n");

    // Find where the player list starts (after the calendar link)
    let baseMessageEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].includes("Записавшиеся игроки:") ||
        lines[i].includes("Игра отменена. Waitlist:")
      ) {
        baseMessageEndIndex = i;
        break;
      }
    }

    if (baseMessageEndIndex === -1) {
      return [];
    }

    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    return Array.from(registrations.values()).map(({ displayName, level }) => ({
      userName: displayName,
      skillLevel: level,
    }));
  }

  /**
   * Gets the current time string in Dubai timezone
   */
  static getCurrentDubaiTime(): string {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Dubai",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Gets the date range for the upcoming week (next Monday to Sunday)
   */
  static getCurrentWeekDateRange(): string {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate days until next Monday (if today is Monday, get next Monday)
    const daysUntilNextMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7;

    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilNextMonday);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Dubai",
      });
    };

    return `${formatDate(nextMonday)}-${formatDate(nextSunday)}`;
  }

  /**
   * Parses game date and time from message and calculates hours remaining until game
   */
  static getHoursUntilGame(messageText: string): number | null {
    try {
      // Extract date and time from message like "🎾 Вторник, 07.01, 8:00-09:30"
      const gameTimeMatch = messageText.match(
        /🎾[\s\S]*?(\d{2}\.\d{2})[\s\S]*?(\d{1,2}:\d{2})-\d{1,2}:\d{2}/
      );

      if (!gameTimeMatch) {
        return null;
      }

      const [, dateStr, startTimeStr] = gameTimeMatch;
      const [day, month] = dateStr.split(".");
      const [hours, minutes] = startTimeStr.split(":");

      // Current year (games are typically scheduled for current year)
      const currentYear = new Date().getFullYear();

      // Create game date in Dubai timezone
      const gameDate = new Date(
        currentYear,
        parseInt(month) - 1, // Month is 0-based
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      // Get current time in Dubai timezone
      const now = new Date();
      const nowInDubai = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Dubai" })
      );

      // Calculate difference in hours
      const diffInMs = gameDate.getTime() - nowInDubai.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return diffInHours;
    } catch (error) {
      console.error("Error parsing game time:", error);
      return null;
    }
  }

  /**
   * Checks if cancellation is within 24 hours of game time
   */
  static isLateCancellation(messageText: string): {
    isLate: boolean;
    hoursRemaining: number | null;
  } {
    const hoursRemaining = this.getHoursUntilGame(messageText);

    if (hoursRemaining === null) {
      return { isLate: false, hoursRemaining: null };
    }

    // Consider it a late cancellation if less than 24 hours remain
    const isLate = hoursRemaining > 0 && hoursRemaining < 24;

    return { isLate, hoursRemaining };
  }

  /**
   * Cancels a game by updating the message to show cancellation status
   */
  static cancelGame(messageText: string): string {
    // Replace the main status line to indicate cancellation
    let updatedMessage = messageText;

    // Update the players section header
    if (updatedMessage.includes("Записавшиеся игроки:")) {
      updatedMessage = updatedMessage.replace(
        "Записавшиеся игроки:",
        "❗️<b>ОТМЕНА</b>❗️\n\nИгра отменена администратором.\n\n<b>Записанные игроки были:</b>"
      );
    }

    // Add cancellation marker to the game title if not already present
    if (!updatedMessage.includes("❗️<b>ОТМЕНА</b>❗️")) {
      updatedMessage = updatedMessage.replace(
        /^🎾 (<b>.*?<\/b>)/m,
        "🎾 $1\n\n❗️<b>ОТМЕНА</b>❗️"
      );
    }

    return updatedMessage;
  }

  /**
   * Restores a cancelled game by removing cancellation markers
   */
  static restoreGame(messageText: string): string {
    let updatedMessage = messageText;

    // Remove cancellation markers from title
    updatedMessage = updatedMessage.replace(/\n\n❗️<b>ОТМЕНА<\/b>❗️/g, "");
    updatedMessage = updatedMessage.replace(/❗️<b>ОТМЕНА<\/b>❗️\n\n/g, "");

    // Remove cancellation text and restore players section
    updatedMessage = updatedMessage.replace(
      /❗️<b>ОТМЕНА<\/b>❗️\n\nИгра отменена администратором\.\n\n<b>Записанные игроки были:<\/b>/g,
      "<b>Записавшиеся игроки:</b>"
    );

    // Fallback: just remove the cancellation text if pattern doesn't match exactly
    updatedMessage = updatedMessage.replace(
      /Игра отменена администратором\.\n\n/g,
      ""
    );
    updatedMessage = updatedMessage.replace(
      /<b>Записанные игроки были:<\/b>/g,
      "<b>Записавшиеся игроки:</b>"
    );

    return updatedMessage;
  }

  /**
   * Gets game statistics (player count, waitlist count)
   */
  static getGameStats(messageText: string): {
    registeredCount: number;
    waitlistCount: number;
    totalCount: number;
  } {
    const lines = messageText.split("\n");

    // Find where the player list starts
    let baseMessageEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].includes("Записавшиеся игроки:") ||
        lines[i].includes("Записанные игроки были:") ||
        lines[i].includes("Игра отменена. Waitlist:")
      ) {
        baseMessageEndIndex = i;
        break;
      }
    }

    if (baseMessageEndIndex === -1) {
      return { registeredCount: 0, waitlistCount: 0, totalCount: 0 };
    }

    const { registrations, waitlist } = this.parseRegistrationsAndWaitlist(
      lines,
      baseMessageEndIndex
    );

    const registeredCount = registrations.size;
    const waitlistCount = waitlist.size;
    const totalCount = registeredCount + waitlistCount;

    return { registeredCount, waitlistCount, totalCount };
  }

  /**
   * Creates a private admin control message for a game
   */
  static createAdminControlMessage(
    gameMessage: string,
    chatId: number,
    messageId: number
  ): string {
    // Extract game title and basic info
    const titleMatch = gameMessage.match(/🎾 <b>(.+?)<\/b>/);
    const locationMatch = gameMessage.match(/📍 <b>Место:<\/b> (.+?)(?=\n|💵)/);

    const title = titleMatch ? titleMatch[1] : "Неизвестная игра";
    const location = locationMatch
      ? locationMatch[1].replace(/<[^>]*>/g, "")
      : "Неизвестное место";

    // Get current statistics
    const stats = this.getGameStats(gameMessage);

    return `🔧 <b>Панель администратора</b>

🎾 <b>Игра:</b> ${title}
📍 <b>Место:</b> ${location}

📊 <b>Статистика:</b>
👥 Записано: ${stats.registeredCount}
⏳ Waitlist: ${stats.waitlistCount}
📈 Всего: ${stats.totalCount}

🔗 <b>Связанное сообщение:</b>
Chat ID: ${chatId}
Message ID: ${messageId}

<i>Используйте кнопки ниже для управления игрой:</i>`;
  }

  /**
   * Extracts game reference data from admin control message
   */
  static extractGameReference(adminMessage: string): {
    chatId: number;
    messageId: number;
  } | null {
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
}
