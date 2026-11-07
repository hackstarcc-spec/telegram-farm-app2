"use client";

import { BOT_USERNAME } from "@coinbarn/shared";

export function ReferralLink({ code, link }: { code?: string; link?: string }) {
  const href =
    link ||
    (code ? `https://t.me/${BOT_USERNAME}?start=ref_${code}` : `https://t.me/${BOT_USERNAME}`);

  return (
    <div className="animate-rise rounded-2xl bg-white/5 p-4">
      <p className="text-sm text-barn-cream/70">Реферальная ссылка</p>
      <p className="mt-2 break-all font-mono text-sm text-barn-hay">{href}</p>
      <button
        type="button"
        className="mt-3 w-full rounded-xl bg-barn-hay px-4 py-2.5 text-sm font-bold text-barn-dusk"
        onClick={() => {
          void navigator.clipboard?.writeText(href);
        }}
      >
        Скопировать
      </button>
      <p className="mt-2 text-xs text-barn-cream/50">5% от farm claim друзей · бонус 500/200</p>
    </div>
  );
}
