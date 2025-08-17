"use client";

import Image from "next/image";
import { CalendarIcon, LocationIcon, LoginIcon } from "@components/icons/Icons";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../hooks/useUser";
import { ScreenName } from "../page";
import {} from "react";
import { useSignOut } from "@lib/hooks/auth";

interface NavigationProps {
  activeScreen: ScreenName;
  setActiveScreen: (screen: ScreenName) => void;
  screenNames: ScreenName[];
}

export default function Navigation({
  activeScreen,
  setActiveScreen,
  screenNames,
}: NavigationProps) {
  const { styles, isLoading, isTelegram } = useTelegram();
  const { isAnonymous, isAdmin, avatarUrl } = useUser();

  // Sign-in UI removed from navigation; handled on landing page

  // Icon color comes from Telegram theme styles via currentColor

  const signOutMutation = useSignOut();
  
  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  // Icons are imported and colored via currentColor from theme styles

  const handleAvatarClick = () => {
    setActiveScreen("settings");
  };

  return (
    <nav
      className="flex items-center justify-between p-4 border-b transition-all duration-200"
      style={{
        ...styles.header,
        ...styles.border,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Render based on mode and auth state */}
        {isTelegram && (isAnonymous || isLoading) ? (
          // Telegram mode: show auth status indicator when anonymous or still loading
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Authenticating..."></div>
            <span className="text-xs" style={styles.secondaryText}>Authenticating</span>
          </div>
        ) : !isTelegram && isAnonymous ? (
          // Web mode: show login button when not authenticated
          <button
            onClick={() => setActiveScreen("login")}
            className="p-3 rounded-full transition-all duration-200 transform hover:scale-110 hover:brightness-110"
            style={activeScreen === "login" ? styles.primaryButton : styles.secondaryButton}
            title="Login"
          >
            <LoginIcon style={activeScreen === "login" ? { color: styles.primaryButton.color } : styles.text} />
          </button>
        ) : !isTelegram && !isAnonymous ? (
          // Web mode: show avatar and sign out when authenticated
          <div className="flex items-center gap-2">
            <div
              className="relative cursor-pointer transform transition-all duration-200 hover:scale-110 group"
              onClick={handleAvatarClick}
              title="User Settings"
            >
              <div className="overflow-hidden rounded-full relative">
                <Image
                  src={avatarUrl || "/settings.svg"}
                  alt="User Photo"
                  width={40}
                  height={40}
                  priority
                  className={`rounded-full transition-all duration-200 ${
                    activeScreen === "settings"
                      ? `ring-2 ring-offset-1`
                      : "group-hover:brightness-110"
                  }`}
                  style={activeScreen === "settings" ? styles.selectedBg : {}}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-full"
                  style={{ backgroundColor: styles.selectedBg.backgroundColor }}
                ></div>
              </div>
              {isAdmin && (
                <div
                  className="absolute bottom-0 right-0"
                  style={{ transform: "translate(20%, 20%)" }}
                >
                  <div
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm"
                    style={{ 
                      backgroundColor: styles.card.backgroundColor,
                      borderColor: styles.selectedBg.borderColor,
                      borderWidth: '1px',
                      color: styles.text.color,
                    }}
                  >
                    Admin
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="px-2 py-1 text-xs rounded-md transition-colors hover:brightness-90"
              style={styles.secondaryButton}
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        ) : (
          // Telegram mode: show avatar when authenticated (no sign out)
          <div
            className="relative cursor-pointer transform transition-all duration-200 hover:scale-110 group"
            onClick={handleAvatarClick}
            title="User Settings"
          >
            <div className="overflow-hidden rounded-full relative">
              <Image
                src={avatarUrl || "/settings.svg"}
                alt="User Photo"
                width={40}
                height={40}
                priority
                className={`rounded-full transition-all duration-200 ${
                  activeScreen === "settings"
                    ? `ring-2 ring-offset-1`
                    : "group-hover:brightness-110"
                }`}
                style={activeScreen === "settings" ? styles.selectedBg : {}}
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-full"
                style={{ backgroundColor: styles.selectedBg.backgroundColor }}
              ></div>
            </div>
            {isAdmin && (
              <div
                className="absolute bottom-0 right-0"
                style={{ transform: "translate(20%, 20%)" }}
              >
                <div
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm`}
                  style={{ 
                    backgroundColor: styles.card.backgroundColor,
                    borderColor: styles.selectedBg.borderColor,
                    borderWidth: '1px',
                    color: styles.text.color,
                  }}
                >
                  Admin
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {screenNames
          .filter((screen) => screen !== "login")
          .map((screen) => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110`}
              style={activeScreen === screen ? styles.primaryButton : styles.secondaryButton}
              title={screen.charAt(0).toUpperCase() + screen.slice(1)}
            >
              {screen === "bookings" && (
                <CalendarIcon style={activeScreen === screen ? { color: styles.primaryButton.color } : styles.text} />
              )}
              {screen === "locations" && (
                <LocationIcon style={activeScreen === screen ? { color: styles.primaryButton.color } : styles.text} />
              )}
            </button>
          ))}
      </div>
    </nav>
  );
}
