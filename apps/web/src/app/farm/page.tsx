"use client";

import { TapButton } from "@/components/farm/TapButton";
import { EnergyBar } from "@/components/farm/EnergyBar";
import { StorageBar } from "@/components/farm/StorageBar";
import { useAuth } from "@/hooks/useAuth";
import { useFarmState } from "@/hooks/useFarmState";
import { useEnergyTick } from "@/hooks/useEnergyTick";
import { formatCoins } from "@/lib/format";

export default function FarmPage() {
  const { token, error } = useAuth();
  const { state, tap, claim } = useFarmState(token);
  const energy = useEnergyTick(state);

  return (
    <main className="animate-rise flex flex-1 flex-col">
      <p className="font-display text-4xl font-bold tracking-tight text-barn-hay">CoinBarn</p>
      <p className="mt-1 text-sm text-barn-cream/70">Тапай и копи офлайн-фарм</p>
      {error ? <p className="mt-2 text-xs text-amber-300/90">{error}</p> : null}

      <p className="mt-8 text-center font-display text-5xl font-bold tabular-nums text-barn-cream">
        {formatCoins(state.coins)}
      </p>
      <p className="text-center text-xs text-barn-cream/50">
        {state.farmRatePerHour}/ч · {state.coinsPerTap}/тап
      </p>

      <TapButton onTap={() => void tap(1)} />
      <EnergyBar energy={energy} energyMax={state.energyMax} />
      <StorageBar
        accumulated={state.storageAccumulated}
        cap={state.storageCap}
        onClaim={() => void claim()}
      />
    </main>
  );
}
