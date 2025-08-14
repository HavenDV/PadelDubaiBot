"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTelegram } from "@/app/contexts/TelegramContext";

export type TelegramLoginButtonProps = {
  callbackPath?: string; // default: "/callbacks/auth/telegram"
  botUsername?: string; // default: "padel_dubai_bot"
  size?: "large" | "medium" | "small"; // default: "large"
  radius?: number; // default: 8
  className?: string; // wrapper classes (e.g. height, rounding)
  allowedHosts?: string[]; // default: ["padel-dubai-bot-five.vercel.app", "www.padel-dubai-bot-five.vercel.app"]
};

export default function TelegramLoginButton({
  callbackPath = "/callbacks/auth/telegram",
  botUsername = "padel_dubai_bot",
  size = "large",
  radius = 8,
  className = "inline-flex h-11 w-[312px] rounded-md overflow-hidden",
  allowedHosts = [
    "padel-dubai-bot-five.vercel.app",
    "www.padel-dubai-bot-five.vercel.app",
  ],
}: TelegramLoginButtonProps) {
  const { webApp } = useTelegram();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { shouldRender, authUrl } = useMemo(() => {
    if (typeof window === "undefined") {
      return { shouldRender: false, authUrl: null as string | null };
    }
    const host = window.location.hostname;
    const isAllowed = allowedHosts.includes(host) && !webApp;
    const url = isAllowed ? `${window.location.origin}${callbackPath}` : null;
    return { shouldRender: isAllowed, authUrl: url };
  }, [allowedHosts, callbackPath, webApp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Clear any previous
    container.innerHTML = "";

    if (!shouldRender || !authUrl) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", size);
    script.setAttribute("data-radius", String(radius));
    script.setAttribute("data-auth-url", authUrl);
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);

    return () => {
      try {
        container.innerHTML = "";
      } catch {
        // ignore
      }
    };
  }, [shouldRender, authUrl, botUsername, size, radius]);

  if (!shouldRender) return null;

  return <div ref={containerRef} className={className} />;
}
