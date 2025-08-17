import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/app/contexts/TelegramContext";
import { QueryProvider } from "@/app/contexts/QueryProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Padel Dubai",
  description: "Your Padel booking app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="overflow-x-hidden h-full"
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-[100dvh] w-full`}
      >
        <QueryProvider>
          <TelegramProvider>{children}</TelegramProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
