"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTelegram } from "@/app/hooks/useTelegram";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(true);

    const observer = new MutationObserver(() => {
      if (container.querySelector("iframe") || container.querySelector("a")) {
        setIsLoading(false);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => setIsLoading(false), 1500);

    container.appendChild(script);

    return () => {
      try {
        container.innerHTML = "";
      } catch {
        // ignore
      }
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [shouldRender, authUrl, botUsername, size, radius]);

  if (!shouldRender) return null;

  return (
    <div className={className}>
      {isLoading && (
        <div className="h-full w-full rounded-md bg-gray-200 animate-pulse" />
      )}
      <div
        ref={containerRef}
        className={isLoading ? "opacity-0 pointer-events-none" : "opacity-100"}
      />
    </div>
  );
}
