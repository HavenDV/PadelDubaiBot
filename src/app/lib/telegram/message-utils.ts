// Message formatting utilities

export interface UserRegistration {
  userName: string;
  skillLevel: string;
}

export class MessageUtils {
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
    const baseMessageEndIndex = lines.findIndex(
      (line) =>
        line.includes("Записавшиеся игроки:") ||
        line.includes("Игра отменена. Waitlist:")
    );

    if (baseMessageEndIndex === -1) {
      return { updatedMessage: currentText }; // Fallback if message format is unexpected
    }

    // Get the base message part
    const baseMessage = lines.slice(0, baseMessageEndIndex + 1).join("\n");

    // Parse existing registrations and waitlist
    const { registrations, waitlist } = this.parseRegistrationsAndWaitlist(
      lines,
      baseMessageEndIndex
    );

    const key = this.normalizeName(displayName);
    let notification: string | undefined;

    // Handle user selection
    if (skillLevel === "not_coming") {
      // User is canceling
      const wasInMain = registrations.has(key);
      const wasInWaitlist = waitlist.has(key);

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
      const wasInMain = registrations.has(key);
      const wasInWaitlist = waitlist.has(key);

      if (wasInMain || wasInWaitlist) {
        // Update existing registration
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
  private static normalizeName(name: string): string {
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

    // Add waitlist if there are players waiting
    if (waitlist.size > 0) {
      updatedMessage += "\n\n⏳ <b>Waitlist:</b>";
      let waitCounter = 1;
      for (const { displayName, level } of waitlist.values()) {
        updatedMessage += `\n${waitCounter}. ${displayName} (${level})`;
        waitCounter++;
      }
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
    const baseMessageEndIndex = lines.findIndex(
      (line) =>
        line.includes("Записавшиеся игроки:") ||
        line.includes("Игра отменена. Waitlist:")
    );

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
}
