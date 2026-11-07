"use client";

import { useState } from "react";

export function TapButton({ onTap }: { onTap: () => void }) {
  const [pulse, setPulse] = useState(false);
  return (
    <button
      type="button"
      aria-label="Tap to earn"
      onClick={() => {
        setPulse(true);
        onTap();
        window.setTimeout(() => setPulse(false), 180);
      }}
      className={`relative mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-b from-barn-hay to-[#b8862a] text-barn-dusk shadow-[0_12px_40px_rgba(232,184,74,0.35)] transition active:brightness-95 ${
        pulse ? "animate-tap" : ""
      }`}
    >
      <span className="font-display text-3xl font-bold tracking-tight">TAP</span>
      <span className="pointer-events-none absolute inset-3 rounded-full border border-white/25" />
    </button>
  );
}
