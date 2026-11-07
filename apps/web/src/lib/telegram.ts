/** Telegram WebApp stub — works in browser without Telegram (dev). */

export type TelegramWebAppLike = {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  ready: () => void;
  expand: () => void;
  themeParams: Record<string, string>;
  openTelegramLink?: (url: string) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebAppLike };
  }
}

const stub: TelegramWebAppLike = {
  initData: "",
  initDataUnsafe: {
    user: {
      id: 0,
      first_name: "Dev",
      username: "devuser",
    },
  },
  ready: () => undefined,
  expand: () => undefined,
  themeParams: {},
};

export function getTelegramWebApp(): TelegramWebAppLike {
  if (typeof window === "undefined") return stub;
  return window.Telegram?.WebApp ?? stub;
}

export function bootTelegram() {
  const wa = getTelegramWebApp();
  wa.ready();
  wa.expand();
  return wa;
}
