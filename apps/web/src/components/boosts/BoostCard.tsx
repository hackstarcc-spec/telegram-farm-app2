import { formatCoins } from "@/lib/format";

export function BoostCard({
  name,
  description,
  level,
  maxLevel,
  nextPrice,
  onBuy,
}: {
  name: string;
  description: string | null;
  level: number;
  maxLevel: number;
  nextPrice: number | null;
  onBuy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-4">
      <div>
        <p className="font-semibold text-barn-cream">{name}</p>
        {description ? <p className="text-xs text-barn-cream/60">{description}</p> : null}
        <p className="mt-1 text-xs text-barn-hay">
          Lv {level}/{maxLevel}
        </p>
      </div>
      <button
        type="button"
        disabled={nextPrice === null}
        onClick={onBuy}
        className="shrink-0 rounded-lg bg-barn-hay px-3 py-2 text-sm font-bold text-barn-dusk disabled:opacity-40"
      >
        {nextPrice === null ? "MAX" : formatCoins(nextPrice)}
      </button>
    </div>
  );
}
