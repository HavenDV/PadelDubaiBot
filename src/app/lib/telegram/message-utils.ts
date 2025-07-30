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
  ): string {
    // Split the message into parts
    const lines = currentText.split("\n");
    const baseMessageEndIndex = lines.findIndex(
      (line) =>
        line.includes("Записавшиеся игроки:") ||
        line.includes("Игра отменена. Waitlist:")
    );

    if (baseMessageEndIndex === -1) {
      return currentText; // Fallback if message format is unexpected
    }

    // Get the base message part
    const baseMessage = lines.slice(0, baseMessageEndIndex + 1).join("\n");

    // Parse existing registrations
    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    const key = this.normalizeName(displayName);

    // Update or add user registration
    if (skillLevel === "not_coming") {
      registrations.delete(key);
    } else {
      registrations.set(key, { displayName, level: skillLevel });
    }

    // Build the updated message
    return this.buildUpdatedMessage(baseMessage, registrations);
  }

  /**
   * Parses existing user registrations from message lines
   */
  private static parseExistingRegistrations(
    lines: string[],
    baseMessageEndIndex: number
  ): Map<string, { displayName: string; level: string }> {
    const registrations = new Map<
      string,
      { displayName: string; level: string }
    >();
    const existingLines = lines.slice(baseMessageEndIndex + 1);

    // Parse existing registrations
    for (const line of existingLines) {
      if (line.trim()) {
        // Match patterns like "🎾 <a href=...>@nick</a> (D+)" or "🎾 @nick (D+)" or numbered entries like "1. Name (D+)"
        const levelMatch = line.match(/^(?:\d+\.\s+|🎾\s*)?(.+?)\s*\((.+?)\)$/);
        if (levelMatch) {
          const [, rawName, level] = levelMatch;
          const key = this.normalizeName(rawName.trim());
          registrations.set(key, {
            displayName: rawName.trim(),
            level: level.trim(),
          });
        }
      }
    }

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
   * Builds the updated message with user registrations
   */
  private static buildUpdatedMessage(
    baseMessage: string,
    registrations: Map<string, { displayName: string; level: string }>
  ): string {
    let updatedMessage = baseMessage;

    if (registrations.size > 0) {
      updatedMessage += "\n";
      let counter = 1;
      for (const { displayName, level } of registrations.values()) {
        updatedMessage += `\n${counter}. ${displayName} (${level})`;
        counter++;
      }
    }

    return updatedMessage;
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
   * Gets the current date range for the week
   */
  static getCurrentWeekDateRange(): string {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Dubai",
      });
    };

    return `${formatDate(monday)}-${formatDate(sunday)}`;
  }
}
