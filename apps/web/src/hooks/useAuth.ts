"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { bootTelegram } from "@/lib/telegram";

const TOKEN_KEY = "coinbarn_access";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (existing) {
      setToken(existing);
      setLoading(false);
      return;
    }

    const wa = bootTelegram();
    if (!wa.initData) {
      // Browser stub: skip real auth until Telegram / BOT_TOKEN wired.
      setLoading(false);
      setError("No Telegram initData (dev stub). Open inside CoinBarnBot Mini App.");
      return;
    }

    apiFetch<{ accessToken: string }>("/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ initData: wa.initData }),
    })
      .then((res) => {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        setToken(res.accessToken);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { token, loading, error };
}
