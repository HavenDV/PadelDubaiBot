"use client";

import { JSX, useState } from "react";
import { useTelegram } from "@contexts/TelegramContext";
import Settings from "@components/settings";
import Navigation from "@components/navigation";
import ConsoleLoggerScript from "./components/debug/ConsoleLoggerScript";
import Locations from "./components/locations";
import Bookings from "./components/bookings";
// import GameSchedules from "@components/game-schedules";
// import GameLocations from "@components/game-locations";
// import History from "@components/history";

export type ScreenName =
  // | "history"
  "settings" | "locations" | "bookings";
// | "locations"
// | "schedules"

export default function Home() {
  const { theme, isAdmin } = useTelegram();

  const [activeScreen, setActiveScreen] = useState<ScreenName>("settings");

  const screens: Record<ScreenName, JSX.Element> = {
    settings: <Settings />,
    locations: <Locations />,
    bookings: <Bookings />,
    // history: <History />,
    // schedules: <GameSchedules />,
  };

  // Get visible navigation items (settings is accessed via avatar)
  const visibleScreens = isAdmin
    ? (["locations", "bookings"] as ScreenName[])
    : ([] as ScreenName[]);

  return (
    <>
      <div className={`${theme.bg} flex flex-auto flex-col`}>
        <Navigation
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          screenNames={visibleScreens}
        />
        {screens[activeScreen]}
        {/* <Footer setActiveScreen={setActiveScreen}/> */}
      </div>
      {isAdmin && <ConsoleLoggerScript />}
    </>
  );
}
