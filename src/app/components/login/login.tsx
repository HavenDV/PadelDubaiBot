"use client";

import { useOAuthSignIn } from "@lib/hooks/auth";
import TelegramLoginButton from "./TelegramLoginButton";

interface LoginProps {
  className?: string;
}

export default function Login({ className = "" }: LoginProps) {
  const oAuthSignInMutation = useOAuthSignIn();
  
  const handleOAuthLogin = (provider: "google") => {
    oAuthSignInMutation.mutate(provider);
  };

  return (
    <div className={`p-4 space-y-6 ${className}`}>
      <div className="flex justify-center flex-wrap items-center gap-3">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="inline-flex h-11 items-center justify-center gap-2 px-4 rounded-md text-sm font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
          aria-label="Sign in with Google"
        >
          Sign in with Google
        </button>
        <TelegramLoginButton className="inline-flex h-11 rounded-md overflow-hidden" />
      </div>
    </div>
  );
}
