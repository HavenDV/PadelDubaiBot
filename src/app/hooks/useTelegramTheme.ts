import React from "react";
import { ThemeParams } from "telegram-web-app";

export interface TelegramTheme {
  // Backgrounds
  bg: string;
  cardBg: string;
  headerBg: string;
  tableHeaderBg: string;

  // Texts
  text: string;
  secondaryText: string;
  tableHeaderText: string;

  // Borders
  border: string;
  tableBorder: string;

  // Buttons
  primaryButton: string;
  primaryButtonHover: string;
  secondaryButton: string;
  secondaryButtonHover: string;

  // Selection
  selectedBg: string;
  selectedBorder: string;

  // Hovers
  tableRowHover: string;

  // Inline styles for dynamic colors
  bgStyle: React.CSSProperties;
  cardBgStyle: React.CSSProperties;
  headerBgStyle: React.CSSProperties;
  tableHeaderBgStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  secondaryTextStyle: React.CSSProperties;
  tableHeaderTextStyle: React.CSSProperties;
  borderStyle: React.CSSProperties;
  tableBorderStyle: React.CSSProperties;
  primaryButtonStyle: React.CSSProperties;
  selectedBgStyle: React.CSSProperties;
  selectedBorderStyle: React.CSSProperties;
}

// Default theme parameters for when themeParams is null
// For non-Telegram scenarios, use the original Tailwind colors
const defaultThemeParams: ThemeParams = {
  bg_color: "#111827", // gray-900
  secondary_bg_color: "#1f2937", // gray-800
  header_bg_color: "#111827", // gray-900
  text_color: "#ffffff", // white
  hint_color: "#d1d5db", // gray-300
  subtitle_text_color: "#d1d5db", // gray-300
  button_color: "#2563eb", // blue-600
  button_text_color: "#ffffff", // white
  link_color: "#3b82f6", // blue-500
  accent_text_color: "#3b82f6", // blue-500
  destructive_text_color: "#ef4444", // red-500
  section_bg_color: "#111827", // gray-900
  section_header_text_color: "#d1d5db", // gray-300
  bottom_bar_bg_color: "#1f2937", // gray-800
};

// Telegram dark theme parameters for reference
// This is kept for documentation purposes and potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const telegramDarkTheme: ThemeParams = {
  accent_text_color: "#6ab2f2",
  bg_color: "#17212b",
  button_color: "#5288c1",
  button_text_color: "#ffffff",
  bottom_bar_bg_color: "#ffffff",
  destructive_text_color: "#ec3942",
  header_bg_color: "#17212b",
  hint_color: "#708499",
  link_color: "#6ab3f3",
  secondary_bg_color: "#232e3c",
  section_bg_color: "#17212b",
  section_header_text_color: "#6ab3f3",
  subtitle_text_color: "#708499",
  text_color: "#f5f5f5",
};

/**
 * Converts Telegram theme parameters to Tailwind CSS classes and inline styles
 */
export function useTelegramTheme(
  themeParams: ThemeParams | null
): TelegramTheme {
  // Check if we have actual Telegram theme parameters
  const hasTelegramTheme = themeParams !== null;
  
  // Use provided theme params or fall back to defaults
  const params = themeParams || defaultThemeParams;

  // Determine if the theme is dark based on background color (for future use)
  // const isDark = isColorDark(params.bg_color || "#111827");

  // Get the actual colors
  const bgColor = params.bg_color || "#111827";
  const secondaryBgColor = params.secondary_bg_color || "#1f2937";
  const headerBgColor = params.header_bg_color || "#111827";
  const textColor = params.text_color || "#ffffff";
  const hintColor = params.hint_color || "#d1d5db";
  const subtitleTextColor = params.subtitle_text_color || "#d1d5db";
  const buttonColor = params.button_color || "#2563eb";

  // If we have Telegram theme, use minimal/transparent classes to let inline styles take precedence
  // If no Telegram theme, use Tailwind classes as normal
  const classes = {
    // Backgrounds
    bg: hasTelegramTheme ? "" : "bg-gray-900",
    cardBg: hasTelegramTheme ? "" : "bg-gray-800", 
    headerBg: hasTelegramTheme ? "" : "bg-gray-900",
    tableHeaderBg: hasTelegramTheme ? "" : "bg-gray-900",

    // Texts
    text: hasTelegramTheme ? "" : "text-white",
    secondaryText: hasTelegramTheme ? "" : "text-gray-300",
    tableHeaderText: hasTelegramTheme ? "" : "text-gray-300",

    // Borders
    border: hasTelegramTheme ? "border" : "border-gray-700",
    tableBorder: hasTelegramTheme ? "border" : "border-gray-700",

    // Buttons
    primaryButton: hasTelegramTheme ? "" : "bg-blue-600",
    primaryButtonHover: hasTelegramTheme ? "hover:brightness-110 transition-all" : "hover:bg-blue-700 transition-all",
    secondaryButton: hasTelegramTheme ? "" : "bg-gray-700",
    secondaryButtonHover: hasTelegramTheme ? "hover:brightness-90 transition-all" : "hover:bg-gray-600 transition-all",

    // Selection
    selectedBg: hasTelegramTheme ? "" : "bg-blue-900 bg-opacity-20",
    selectedBorder: hasTelegramTheme ? "border" : "border-blue-600",

    // Hovers
    tableRowHover: hasTelegramTheme ? "hover:brightness-110 transition-colors" : "hover:bg-gray-700 transition-colors",
  };

  return {
    // CSS classes (empty when using Telegram theme, fallback Tailwind when not)
    ...classes,

    // Inline styles for dynamic colors (only when using Telegram theme)
    bgStyle: hasTelegramTheme ? { backgroundColor: bgColor } : {},
    cardBgStyle: hasTelegramTheme ? { backgroundColor: secondaryBgColor } : {},
    headerBgStyle: hasTelegramTheme ? { backgroundColor: headerBgColor } : {},
    tableHeaderBgStyle: hasTelegramTheme ? { backgroundColor: headerBgColor } : {},
    textStyle: hasTelegramTheme ? { color: textColor } : {},
    secondaryTextStyle: hasTelegramTheme ? { color: hintColor } : {},
    tableHeaderTextStyle: hasTelegramTheme ? { color: subtitleTextColor } : {},
    borderStyle: hasTelegramTheme ? { borderColor: adjustColorOpacity(secondaryBgColor, 0.3) } : {},
    tableBorderStyle: hasTelegramTheme ? { borderColor: adjustColorOpacity(secondaryBgColor, 0.3) } : {},
    primaryButtonStyle: hasTelegramTheme ? { backgroundColor: buttonColor, color: params.button_text_color || "#ffffff" } : {},
    selectedBgStyle: hasTelegramTheme ? { backgroundColor: adjustColorOpacity(buttonColor, 0.2) } : {},
    selectedBorderStyle: hasTelegramTheme ? { borderColor: buttonColor } : {},
  };
}

/**
 * Determines if a color is dark based on its luminance
 * Currently unused but kept for future theme detection needs
 */
// function isColorDark(color: string): boolean {
//   // Remove the hash if it exists
//   const hex = color.replace("#", "");

//   // Parse the hex values
//   const r = parseInt(hex.substring(0, 2), 16);
//   const g = parseInt(hex.substring(2, 4), 16);
//   const b = parseInt(hex.substring(4, 6), 16);

//   // Calculate luminance (perceived brightness)
//   // Formula: 0.299*R + 0.587*G + 0.114*B
//   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

//   // Return true if the color is dark (luminance < 0.5)
//   return luminance < 0.5;
// }

/**
 * Adjusts the opacity of a hex color
 */
function adjustColorOpacity(color: string, opacity: number): string {
  // Remove the hash if it exists
  const hex = color.replace("#", "");
  
  // Convert opacity to hex (0-1 to 00-FF)
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, "0");
  
  return `#${hex}${alpha}`;
}
