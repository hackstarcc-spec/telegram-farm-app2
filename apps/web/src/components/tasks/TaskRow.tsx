import { formatCoins } from "@/lib/format";

export function TaskRow({
  title,
  description,
  rewardCoins,
  status,
}: {
  title: string;
  description: string | null;
  rewardCoins: string;
  status: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/10 py-4">
      <div>
        <p className="font-semibold">{title}</p>
        {description ? <p className="text-xs text-barn-cream/60">{description}</p> : null}
        <p className="mt-1 text-xs text-barn-hay">+{formatCoins(rewardCoins)}</p>
      </div>
      <span className="text-xs uppercase tracking-wide text-barn-cream/50">{status}</span>
    </div>
  );
}
