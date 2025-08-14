"use client";

import Image from "next/image";
import { useTelegram } from "@contexts/TelegramContext";
import { useUser } from "../hooks/useUser";
import { ScreenName } from "../page";
import {} from "react";
import { supabase } from "@lib/supabase/client";

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
  const { webApp, theme, isLoading } = useTelegram();
  const { isAnonymous, isAdmin, email, avatarUrl } = useUser();

  // Sign-in UI removed from navigation; handled on landing page

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const iconMap: Record<ScreenName, string> = {
    settings: "/settings.svg",
    locations: "/location.svg",
    bookings: "/calendar.svg",
    login: "/login.svg",
    // history: "/history.svg",
    // schedules: "/calendar.svg",
  };

  const handleAvatarClick = () => {
    setActiveScreen("settings");
  };

  return (
    <nav
      className={`flex items-center justify-between p-4 border-b ${theme.border}`}
      style={theme.borderStyle}
    >
      <div className="flex items-center gap-3">
        {webApp === null ? (
          // Web mode: avatar/signout only when logged in
          email ? (
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
                    className="rounded-full transition-all duration-200 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-[#4CD964] opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-full"></div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-2 py-1 text-xs rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            // Login button in avatar position when not logged in
            <button
              onClick={() => setActiveScreen("login")}
              className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                activeScreen === "login"
                  ? `${theme.primaryButton} hover:brightness-110`
                  : `${theme.secondaryButton} hover:bg-opacity-80 hover:shadow-md`
              }`}
              style={activeScreen === "login" ? theme.primaryButtonStyle : {}}
              title="Login"
            >
              <Image
                src="/login.svg"
                alt="login"
                width={24}
                height={24}
                priority
                className={
                  activeScreen === "login" 
                    ? "brightness-0 invert" 
                    : "invert opacity-50"
                }
              />
            </button>
          )
        ) : isAnonymous ? (
          <div></div>
        ) : isLoading ? (
          <div className="w-[40px] h-[40px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        ) : (
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
                    ? "ring-2 ring-offset-1 ring-[#4CD964]"
                    : "group-hover:brightness-110"
                }`}
              />
              <div className="absolute inset-0 bg-[#4CD964] opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-full"></div>
            </div>
            {isAdmin && (
              <div
                className="absolute bottom-0 right-0"
                style={{ transform: "translate(20%, 20%)" }}
              >
                <div
                  className="bg-[#0d1c2b] text-[#4CD964] text-[8px] font-bold px-1.5 py-0.5 rounded-sm"
                  style={{ boxShadow: "0 0 0 1px #1a2a3a" }}
                >
                  Admin
                </div>
              </div>
            )}
          </div>
        )}
        {/* Hide name label; use avatar only */}
      </div>

      <div className="flex space-x-4">
        {screenNames
          .filter((screen) => screen !== "login")
          .map((screen) => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                activeScreen === screen
                  ? `${theme.primaryButton} hover:brightness-110`
                  : `${theme.secondaryButton} hover:bg-opacity-80 hover:shadow-md`
              }`}
              style={activeScreen === screen ? theme.primaryButtonStyle : {}}
              title={screen.charAt(0).toUpperCase() + screen.slice(1)}
            >
              <Image
                src={iconMap[screen]}
                alt={screen}
                width={24}
                height={24}
                priority
                className={
                  activeScreen === screen 
                    ? "brightness-0 invert" 
                    : "invert opacity-50"
                }
              />
            </button>
          ))}
      </div>
    </nav>
  );
}
