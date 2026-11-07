"use client";

import { useCallback, useEffect, useState } from "react";
import type { FarmState } from "@coinbarn/shared";
import { apiFetch } from "@/lib/api-client";

const empty: FarmState = {
  coins: "0",
  totalEarned: "0",
  energy: 100,
  energyMax: 100,
  energyUpdatedAt: new Date().toISOString(),
  farmRatePerHour: 100,
  storageCap: "5000",
  storageAccumulated: "0",
  farmUpdatedAt: new Date().toISOString(),
  coinsPerTap: 1,
  tapEnergyCost: 1,
  storageFull: false,
};

export function useFarmState(token: string | null) {
  const [state, setState] = useState<FarmState>(empty);

  const refresh = useCallback(async () => {
    if (!token) return;
    const next = await apiFetch<FarmState>("/farm/state", { token });
    setState(next);
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const tap = useCallback(
    async (count = 1) => {
      if (!token) {
        setState((s) => ({
          ...s,
          coins: String(BigInt(s.coins) + BigInt(count)),
          energy: Math.max(0, s.energy - count),
        }));
        return;
      }
      const next = await apiFetch<FarmState>("/farm/tap", {
        method: "POST",
        token,
        body: JSON.stringify({ count }),
      });
      setState(next);
    },
    [token],
  );

  const claim = useCallback(async () => {
    if (!token) return;
    const next = await apiFetch<FarmState>("/farm/claim", { method: "POST", token });
    setState(next);
  }, [token]);

  return { state, tap, claim, refresh };
}
