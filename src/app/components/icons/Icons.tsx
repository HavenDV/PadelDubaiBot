"use client";

import React from "react";

type IconProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
};

export function CalendarIcon({ size = 24, className = "", style = {}, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 3v4M16 3v4M3 9h18" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function LocationIcon({ size = 24, className = "", style = {}, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function LoginIcon({ size = 24, className = "", style = {}, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M15 12H3" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function SettingsIcon({ size = 24, className = "", style = {}, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M19.4 12a7.4 7.4 0 0 0-.07-.98l2.01-1.57a.5.5 0 0 0 .12-.64l-1.9-3.29a.5.5 0 0 0-.6-.22l-2.37.95a7.47 7.47 0 0 0-1.7-.98l-.36-2.52a.5.5 0 0 0-.5-.43h-3.8a.5.5 0 0 0-.5.43l-.36 2.52c-.61.25-1.18.57-1.7.98l-2.37-.95a.5.5 0 0 0-.6.22L2.54 8.8a.5.5 0 0 0 .11.64l2.01 1.57c-.03.32-.06.65-.06.98s.03.66.06.98L2.65 14.7a.5.5 0 0 0-.11.64l1.9 3.29c.13.22.39.32.6.22l2.37-.95c.52.4 1.09.73 1.7.98l.36 2.52c.05.25.26.43.5.43h3.8c.24 0 .45-.18.5-.43l.36-2.52c.61-.25 1.18-.57 1.7-.98l2.37.95c.21.1.47 0 .6-.22l1.9-3.29a.5.5 0 0 0-.12-.64l-2-1.57c.04-.32.07-.65.07-.98Z" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export function PinIcon({ size = 24, className = "", style = {}, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}

export function PinOffIcon({ size = 24, className = "", style = {}, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v5" />
      <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" />
      <path d="m2 2 20 20" />
      <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
    </svg>
  );
}

export type IconName = "calendar" | "location" | "login" | "settings";

export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  switch (name) {
    case "calendar":
      return <CalendarIcon {...props} />;
    case "location":
      return <LocationIcon {...props} />;
    case "login":
      return <LoginIcon {...props} />;
    case "settings":
      return <SettingsIcon {...props} />;
    default:
      return null;
  }
}
