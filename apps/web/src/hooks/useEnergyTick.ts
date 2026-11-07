"use client";

import { useEffect, useState } from "react";
import type { FarmState } from "@coinbarn/shared";
import { STARTING } from "@coinbarn/shared";

/** Client-side energy preview between server syncs. */
export function useEnergyTick(state: FarmState) {
  const [energy, setEnergy] = useState(state.energy);

  useEffect(() => {
    setEnergy(state.energy);
    const base = new Date(state.energyUpdatedAt).getTime();
    const id = window.setInterval(() => {
      const elapsed = Math.max(0, Math.floor((Date.now() - base) / 1000));
      setEnergy(
        Math.min(state.energyMax, state.energy + elapsed * STARTING.energyRegenPerSec),
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.energy, state.energyMax, state.energyUpdatedAt]);

  return energy;
}
