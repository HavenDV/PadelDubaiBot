"use client";

import { useTelegram } from "@contexts/TelegramContext";
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useLinkedProviders } from "@lib/hooks/auth/useAuthProviders";
import { useLinkProvider } from "@lib/hooks/auth/useLinkProvider";
import { useUserById } from "@/app/lib/hooks/db";
import {
  useUpdateUserSkillLevel,
  type SkillLevel,
} from "@/app/lib/hooks/db/useUserMutations";

export default function Settings() {
  const { styles, isTelegram, themePreference, setThemePreference } = useTelegram();
  const { isAnonymous, telegramUserId } = useUser();
  const [authMessage, setAuthMessage] = useState<string>("");
  const [skillMessage, setSkillMessage] = useState<string>("");
  const [pendingSkillLevel, setPendingSkillLevel] = useState<SkillLevel | null>(
    null
  );

  // Use React Query hooks for data fetching
  const { data: userProfile, error: userProfileError } = useUserById(
    telegramUserId ?? undefined
  );
  const {
    data: linkedProviders = [],
    isLoading: providersLoading,
    error: providersError,
  } = useLinkedProviders(isAnonymous);
  const linkProviderMutation = useLinkProvider();
  const updateSkillLevelMutation = useUpdateUserSkillLevel();

  // Log user profile data when it loads
  useEffect(() => {
    if (userProfile) {
      console.log("Fetched user data:", userProfile);
    }
    if (userProfileError) {
      console.error("User profile error:", userProfileError);
    }
  }, [userProfile, userProfileError]);

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

  const handleSkillLevelUpdate = (skillLevel: SkillLevel) => {
    console.log("handleSkillLevelUpdate called with:", skillLevel);
    console.log("telegramUserId:", telegramUserId);

    if (!telegramUserId) {
      console.error("No telegramUserId available");
      setSkillMessage("Telegram User ID not available");
      return;
    }

    setSkillMessage("");
    setPendingSkillLevel(skillLevel);
    console.log("Starting mutation...");
    updateSkillLevelMutation.mutate(
      { userId: telegramUserId, skillLevel },
      {
        onSuccess: (data) => {
          console.log("Skill level update successful:", data);
          setSkillMessage(`Skill level updated to ${skillLevel}`);
          setPendingSkillLevel(null);
        },
        onError: (error) => {
          console.error("Skill level update error:", error);
          setSkillMessage(error.message || "Failed to update skill level");
          setPendingSkillLevel(null);
        },
      }
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4" style={styles.text}>Settings</h2>

      {/* Appearance (Web only) */}
      {!isTelegram && (
        <div className="space-y-2">
          <label className="text-sm font-medium" style={styles.text}>Appearance</label>
          <div className="flex gap-2">
            {(["system", "light", "dark"] as const).map((pref) => {
              const isActive = themePreference === pref;
              return (
                <button
                  key={pref}
                  onClick={() => setThemePreference(pref)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors border"
                  style={isActive ? styles.primaryButton : { ...styles.secondaryButton, ...styles.border }}
                  aria-pressed={isActive}
                >
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </button>
              );
            })}
          </div>
          <p className="text-xs" style={styles.secondaryText}>Applies to web only. Telegram uses the in‑app theme.</p>
        </div>
      )}

      {/* Skill Level Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" style={styles.text}>
            Skill Level:
          </label>
          <div className="flex gap-1">
            {(["E", "D-", "D", "D+", "D++", "C-", "C", "C+"] as SkillLevel[]).map(
              (level) => {
                const isSelected = (userProfile?.skill_level || "E") === level;
                const isPending = pendingSkillLevel === level && updateSkillLevelMutation.isPending;
                const isDisabled = updateSkillLevelMutation.isPending;

                return (
                  <button
                    key={level}
                    onClick={() => handleSkillLevelUpdate(level)}
                    disabled={isDisabled}
                    className={`px-2 py-1 text-xs rounded transition-colors relative ${
                      isDisabled ? "cursor-not-allowed" : ""
                    }`}
                    style={{
                      ...(isSelected ? styles.primaryButton : styles.secondaryButton),
                      opacity: isDisabled ? 0.6 : 1,
                    }}
                  >
                    {isPending ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      level
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
        {skillMessage && (
          <p
            className={`text-xs ${
              skillMessage.startsWith("Failed") ||
              skillMessage.includes("not available") ||
              skillMessage.includes("error") ||
              skillMessage.includes("Error")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {skillMessage}
          </p>
        )}
      </div>

      {/* Linked Accounts Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium" style={styles.text}>
          Linked accounts
        </label>
        {providersLoading && (
          <div className="text-sm" style={styles.secondaryText}>Loading account status...</div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {(() => {
              const isLinked = linkedProviders.includes("google");
              const isPending = linkProviderMutation.isPending;
              const disabled = isLinked || isPending || providersLoading;
              const label = providersLoading
                ? "Loading..."
                : isLinked
                ? "Google linked"
                : isPending
                ? "Linking..."
                : "Link Google";
              return (
                <button
                  onClick={() => !disabled && handleLinkProvider("google")}
                  disabled={disabled}
                  aria-disabled={disabled}
                  title={isLinked ? "Already linked" : "Link your Google account"}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                    isPending ? "cursor-not-allowed" : isLinked ? "cursor-default" : ""
                  } flex items-center gap-2`}
                  style={{
                    ...(isLinked
                      ? { ...styles.selectedBg, ...styles.border }
                      : { ...styles.secondaryButton, ...styles.border }),
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  {isLinked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      style={styles.text}
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span style={styles.text}>{label}</span>
                </button>
              );
            })()}
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
              className="text-xs"
              style={styles.secondaryText}
            >
              You can link Google to sign in next time outside Telegram.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
