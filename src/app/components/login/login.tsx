"use client";

import { useOAuthSignIn } from "@lib/hooks/auth";
import { useTelegramTheme } from "@/app/hooks/telegram";
import TelegramLoginButton from "./TelegramLoginButton";

interface LoginProps {
  className?: string;
}

export default function Login({ className = "" }: LoginProps) {
  const oAuthSignInMutation = useOAuthSignIn();
  const { styles } = useTelegramTheme();
  
  const handleOAuthLogin = (provider: "google") => {
    oAuthSignInMutation.mutate(provider);
  };

  return (
    <div className={`p-4 space-y-6 ${className}`} style={styles.bg}>
      <div className="flex justify-center flex-wrap items-center gap-3">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="inline-flex h-11 items-center justify-center gap-2 px-4 rounded-md text-sm font-medium transition-colors"
          style={{ ...styles.secondaryButton, ...styles.border }}
          aria-label="Sign in with Google"
        >
          <span style={styles.text}>Sign in with Google</span>
        </button>
        <TelegramLoginButton className="inline-flex h-11 rounded-md overflow-hidden" />
      </div>
    </div>
  );
}
