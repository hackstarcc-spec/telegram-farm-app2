import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { BottomNav } from "@/components/shell/BottomNav";

export const metadata: Metadata = {
  title: "CoinBarn",
  description: "Telegram Mini App farm clicker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-24 pt-4">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
