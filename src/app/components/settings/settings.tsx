"use client";

import { useTelegram } from "@contexts/TelegramContext";
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useLinkedProviders } from "@lib/hooks/auth/useAuthProviders";
import { useLinkProvider } from "@lib/hooks/auth/useLinkProvider";
import { useUserById } from "@/app/lib/hooks/db";

export default function Settings() {
  const { theme, webApp } = useTelegram();
  const { isAnonymous } = useUser();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [authMessage, setAuthMessage] = useState<string>("");

  // Safely get the user ID only on the client
  useEffect(() => {
    // Only try to access webApp properties on the client side
    if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
      setUserId(webApp.initDataUnsafe.user.id);
    }
  }, [webApp]);

  // Use React Query hooks for data fetching
  const { data: userProfile, error: userProfileError } = useUserById(userId);
  const {
    data: linkedProviders = [],
    isLoading: providersLoading,
    error: providersError,
  } = useLinkedProviders(isAnonymous);
  const linkProviderMutation = useLinkProvider();

  // Log user profile data when it loads
  useEffect(() => {
    if (userProfile) {
      console.log("Fetched user data:", userProfile);
    }
  }, [userProfile]);

  // Handle query errors
  useEffect(() => {
    if (userProfileError) {
      console.error("Error fetching user data:", userProfileError);
    }
    if (providersError) {
      console.error("Error loading auth providers:", providersError);
    }
  }, [userProfileError, providersError]);

  const handleLinkProvider = (provider: "google" | "apple") => {
    setAuthMessage("");
    linkProviderMutation.mutate(provider, {
      onError: (error) => {
        setAuthMessage(error.message || "Unexpected error starting link flow");
      },
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className={`text-xl font-bold ${theme.text} mb-4`}>Settings</h2>

      {/* Linked Accounts Section */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${theme.text}`}>
          Linked accounts
        </label>
        {providersLoading && (
          <div className="text-sm text-gray-500">Loading account status...</div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLinkProvider("google")}
              disabled={
                linkProviderMutation.isPending ||
                linkedProviders.includes("google") ||
                providersLoading
              }
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                linkedProviders.includes("google")
                  ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                  : linkProviderMutation.isPending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
              }`}
            >
              {providersLoading
                ? "Loading..."
                : linkedProviders.includes("google")
                ? "Google linked"
                : linkProviderMutation.isPending
                ? "Linking..."
                : "Link Google"}
            </button>
            {/* <button
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
            </button> */}
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
              You can link Google to sign in next time outside Telegram.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
