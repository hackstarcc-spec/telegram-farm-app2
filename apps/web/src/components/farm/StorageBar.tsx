import { formatCoins } from "@/lib/format";

export function StorageBar({
  accumulated,
  cap,
  onClaim,
}: {
  accumulated: string;
  cap: string;
  onClaim: () => void;
}) {
  const a = Number(accumulated);
  const c = Number(cap) || 1;
  const pct = Math.min(100, (a / c) * 100);
  const full = a >= c;
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs text-barn-cream/70">
        <span>Хранилище {full ? "· FULL" : ""}</span>
        <span>
          {formatCoins(accumulated)} / {formatCoins(cap)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-white/10">
        <div
          className="h-full rounded bg-barn-hay transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <button
        type="button"
        disabled={a <= 0}
        onClick={onClaim}
        className="mt-3 w-full rounded-xl bg-barn-leaf px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        Забрать
      </button>
    </div>
  );
}
