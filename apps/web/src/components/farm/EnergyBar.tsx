export function EnergyBar({ energy, energyMax }: { energy: number; energyMax: number }) {
  const pct = energyMax > 0 ? Math.min(100, (energy / energyMax) * 100) : 0;
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs text-barn-cream/70">
        <span>Энергия</span>
        <span>
          {energy}/{energyMax}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-white/10">
        <div
          className="bar-glow h-full rounded bg-barn-leaf transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
