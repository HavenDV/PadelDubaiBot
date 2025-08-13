"use client";

import { useTelegram } from "@contexts/TelegramContext";
import { useState, useEffect, useCallback } from "react";
import { getUser } from "@lib/supabase-queries";
import { supabase } from "@lib/supabase/client";

export default function Settings() {
  const { theme, webApp } = useTelegram();
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Linked accounts state
  const [primaryEmail, setPrimaryEmail] = useState<string | null>(null);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [linkingProvider, setLinkingProvider] = useState<
    "google" | "apple" | null
  >(null);
  const [authMessage, setAuthMessage] = useState<string>("");

  // Safely get the user ID only on the client
  useEffect(() => {
    // Only try to access webApp properties on the client side
    if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      setUserId(webApp.initDataUnsafe.user.id);
    }
  }, [webApp]);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      const user = await getUser(userId);
      console.log("Fetched user data:", user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]);

  useEffect(() => {
    // Fetch the user's current pickup height when component mounts
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  // Fetch auth profile (email + linked identities)
  useEffect(() => {
    const loadAuthProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error loading auth user:", error);
        return;
      }
      const user = data.user;
      setPrimaryEmail(user?.email ?? null);
      const providers = (user?.identities ?? [])
        .map((i) => i.provider)
        .filter(Boolean) as string[];
      setLinkedProviders(providers);
    };
    loadAuthProfile();
  }, []);

  const handleLinkProvider = async (provider: "google" | "apple") => {
    setAuthMessage("");
    setLinkingProvider(provider);
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Link identity error:", error.message);
        setAuthMessage(`Error linking ${provider}: ${error.message}`);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      setAuthMessage("Unexpected error starting link flow");
    } finally {
      setLinkingProvider(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className={`text-xl font-bold ${theme.text} mb-4`}>Settings</h2>

      {/* Linked Accounts Section */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${theme.text}`}>
          Linked accounts
        </label>
        <div className="flex flex-col gap-2">
          <div className={`text-sm ${theme.secondaryText || "text-gray-500"}`}>
            Current email: {primaryEmail ?? "none"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLinkProvider("google")}
              disabled={
                linkingProvider !== null || linkedProviders.includes("google")
              }
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                linkedProviders.includes("google")
                  ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                  : linkingProvider === "google"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
              }`}
            >
              {linkedProviders.includes("google")
                ? "Google linked"
                : "Link Google"}
            </button>
            <button
              onClick={() => handleLinkProvider("apple")}
              disabled={
                linkingProvider !== null || linkedProviders.includes("apple")
              }
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                linkedProviders.includes("apple")
                  ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                  : linkingProvider === "apple"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
              }`}
            >
              {linkedProviders.includes("apple")
                ? "Apple linked"
                : "Link Apple"}
            </button>
          </div>
          {authMessage && (
            <p
              className={`text-sm ${
                authMessage.startsWith("Error")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {authMessage}
            </p>
          )}
          <div className="pt-2 space-y-2">
            <div
              className={`text-xs ${theme.secondaryText || "text-gray-500"}`}
            >
              You can link Google or Apple to sign in next time without
              Telegram.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
