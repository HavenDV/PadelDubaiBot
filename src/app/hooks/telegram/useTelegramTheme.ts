import React, { useCallback, useState, useEffect } from "react";
import { ThemeParams } from "telegram-web-app";
import { useThemePreference } from "../settings/useThemePreference";
import { useTelegramThemeEvent } from "./events";

/**
 * Telegram Mini App Theme Parameters
 *
 * Mini Apps can adjust the appearance of the interface to match the Telegram user's app in real time.
 * This object contains the user's current theme settings.
 *
 * Official Telegram Documentation:
 *
 * bg_color - Background color in #RRGGBB format. Main app background.
 * text_color - Main text color in #RRGGBB format. Primary text content.
 * hint_color - Hint text color in #RRGGBB format. Secondary/muted text.
 * link_color - Link color in #RRGGBB format. Clickable links and accents.
 * button_color - Button color in #RRGGBB format. Primary action buttons.
 * button_text_color - Button text color in #RRGGBB format. Text on primary buttons.
 * secondary_bg_color - Secondary background color in #RRGGBB format. Cards, modals, secondary surfaces.
 * header_bg_color - Header background color in #RRGGBB format. Navigation headers, top sections.
 * bottom_bar_bg_color - Bottom background color in #RRGGBB format. Bottom navigation, footers.
 * accent_text_color - Accent text color in #RRGGBB format. Highlighted text, badges.
 * section_bg_color - Background color for sections in #RRGGBB format. Use with secondary_bg_color.
 * section_header_text_color - Header text color for sections in #RRGGBB format. Section titles.
 * section_separator_color - Section separator color in #RRGGBB format. Dividers, borders.
 * subtitle_text_color - Subtitle text color in #RRGGBB format. Captions, descriptions.
 * destructive_text_color - Text color for destructive actions in #RRGGBB format. Delete, error states.
 *
 * All colors are also available as CSS variables: var(--tg-theme-{property-name})
 */

/**
 * Predefined theme configurations for web mode
 * These represent actual values from different Telegram themes
 */
export const webDarkTheme: ThemeParams = {
  accent_text_color: "#6ab2f2", // Light blue for badges, highlights
  bg_color: "#17212b", // Main dark background
  button_color: "#5288c1", // Telegram signature blue
  button_text_color: "#ffffff", // White text on buttons
  bottom_bar_bg_color: "#232e3c", // Bottom bar
  destructive_text_color: "#ec3942", // Red for delete/error actions
  header_bg_color: "#17212b", // Header matches main background
  hint_color: "#708499", // Muted text, placeholders
  link_color: "#6ab3f3", // Links and clickable elements
  secondary_bg_color: "#232e3c", // Cards, modals, elevated surfaces
  section_bg_color: "#17212b", // Section containers
  section_header_text_color: "#6ab3f3", // Section titles in blue
  section_separator_color: "#2b3544", // Dividers
  subtitle_text_color: "#708499", // Captions, descriptions
  text_color: "#f5f5f5", // Primary text content
};

export const webLightTheme: ThemeParams = {
  accent_text_color: "#007AFF", // iOS blue
  bg_color: "#ffffff", // White background
  button_color: "#007AFF", // Blue buttons
  button_text_color: "#ffffff", // White button text
  bottom_bar_bg_color: "#f7f7f7", // Light gray bottom
  destructive_text_color: "#FF3B30", // iOS red
  header_bg_color: "#ffffff", // White header
  hint_color: "#8E8E93", // iOS gray
  link_color: "#007AFF", // Blue links
  secondary_bg_color: "#f7f7f7", // Light gray cards
  section_bg_color: "#ffffff", // White sections
  section_header_text_color: "#6D6D72", // Gray headers
  section_separator_color: "#C6C6C8", // Light gray dividers
  subtitle_text_color: "#8E8E93", // Gray subtitles
  text_color: "#000000", // Black text
};

/**
 * Extended theme interface that includes both ThemeParams and helper methods
 */
export interface TelegramThemeResult {
  // Original Telegram theme parameters
  params: ThemeParams;
  themeParams: ThemeParams | null; // Raw theme params for compatibility
  colorScheme: "light" | "dark" | null; // Color scheme from Telegram

  // Utility methods
  isInTelegram: boolean;

  // CSS-in-JS styles for components
  styles: {
    bg: React.CSSProperties;
    card: React.CSSProperties;
    header: React.CSSProperties;
    text: React.CSSProperties;
    secondaryText: React.CSSProperties;
    subtitleText: React.CSSProperties;
    accentText: React.CSSProperties;
    destructiveText: React.CSSProperties;
    border: React.CSSProperties;
    primaryButton: React.CSSProperties;
    secondaryButton: React.CSSProperties;
    selectedBg: React.CSSProperties;
    link: React.CSSProperties;
  };
}

/**
 * Independent hook for unified theming that works in both Telegram and web environments
 *
 * Automatically detects Telegram environment and handles theme changes via events.
 * In web mode, uses theme preference settings.
 *
 * @returns TelegramThemeResult with theme parameters and helper methods
 */
export function useTelegramTheme(): TelegramThemeResult {
  // State for theme parameters from Telegram
  const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | null>(null);

  // Web theme preference fallback
  const { themePreference, systemPrefersDark } = useThemePreference();

  // Detect if we're in Telegram
  const [isInTelegram, setIsInTelegram] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const hasInitData = Boolean(
        (webApp.initData && webApp.initData.length > 0) ||
          webApp.initDataUnsafe?.user
      );

      if (hasInitData) {
        setIsInTelegram(true);
        setThemeParams(webApp.themeParams || null);
        setColorScheme(webApp.colorScheme || null);

        // Apply initial theme to document root
        applyThemeToRoot(webApp.themeParams, webApp.colorScheme);
      }
    }
  }, []);

  // Helper function to apply theme to document root
  const applyThemeToRoot = (
    params: ThemeParams | null,
    scheme: string | null
  ) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (params?.bg_color) {
      root.style.setProperty("--background", params.bg_color);
    }
    if (params?.text_color) {
      root.style.setProperty("--foreground", params.text_color);
    }
    if (scheme) {
      root.style.setProperty("color-scheme", scheme);
    }
  };

  // Listen for theme changes in Telegram
  useTelegramThemeEvent(
    ({ themeParams: newThemeParams, colorScheme: newColorScheme }) => {
      console.log("useTelegramTheme: Theme changed via event");
      setThemeParams(newThemeParams);
      setColorScheme(newColorScheme);
      applyThemeToRoot(newThemeParams, newColorScheme);
    },
    undefined, // Let the hook detect webApp automatically
    {
      debug: true,
    }
  );

  // Determine effective theme preference for web mode
  const preferDark =
    themePreference === "system"
      ? systemPrefersDark
      : themePreference === "dark";

  // Use Telegram theme or fallback to predefined web themes
  const params = themeParams || (preferDark ? webDarkTheme : webLightTheme);
  const fallbackTheme = preferDark ? webDarkTheme : webLightTheme;

  // Utility function for color opacity adjustment
  const adjustOpacity = useCallback(
    (color: string, opacity: number): string => {
      const hex = color.replace("#", "");
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0");
      return `#${hex}${alpha}`;
    },
    []
  );

  // Generate component styles - memoize properly with dependencies
  const styles = React.useMemo(() => {
    return {
      bg: {
        backgroundColor: params.bg_color || fallbackTheme.bg_color,
        color: params.text_color || fallbackTheme.text_color,
      },
      card: {
        backgroundColor:
          params.secondary_bg_color || fallbackTheme.secondary_bg_color,
        borderColor:
          params.section_separator_color ||
          fallbackTheme.section_separator_color,
        borderWidth: "1px",
      },
      header: {
        backgroundColor:
          params.header_bg_color ||
          params.bg_color ||
          fallbackTheme.header_bg_color,
        borderColor:
          params.section_separator_color ||
          fallbackTheme.section_separator_color,
      },
      text: {
        color: params.text_color || fallbackTheme.text_color,
      },
      secondaryText: {
        color: params.hint_color || fallbackTheme.hint_color,
      },
      subtitleText: {
        color: params.subtitle_text_color || fallbackTheme.subtitle_text_color,
      },
      accentText: {
        color: params.accent_text_color || fallbackTheme.accent_text_color,
      },
      destructiveText: {
        color:
          params.destructive_text_color || fallbackTheme.destructive_text_color,
      },
      border: {
        borderColor:
          params.section_separator_color ||
          fallbackTheme.section_separator_color,
      },
      primaryButton: {
        backgroundColor: params.button_color || fallbackTheme.button_color,
        color: params.button_text_color || fallbackTheme.button_text_color,
        borderWidth: "1px",
        borderColor: params.button_color || fallbackTheme.button_color,
      },
      secondaryButton: {
        backgroundColor:
          params.secondary_bg_color || fallbackTheme.secondary_bg_color,
        color: params.text_color || fallbackTheme.text_color,
        borderWidth: "1px",
        borderColor:
          params.section_separator_color ||
          fallbackTheme.section_separator_color,
      },
      selectedBg: {
        backgroundColor: adjustOpacity(
          params.button_color || fallbackTheme.button_color || "#2563eb",
          0.1
        ),
        borderColor:
          params.button_color || fallbackTheme.button_color || "#2563eb",
        borderWidth: "1px",
      },
      link: {
        color:
          params.link_color ||
          params.button_color ||
          fallbackTheme.link_color ||
          fallbackTheme.button_color,
      },
    };
  }, [params, adjustOpacity, fallbackTheme]);

  return {
    params,
    themeParams,
    colorScheme,
    isInTelegram,
    styles,
  };
}
