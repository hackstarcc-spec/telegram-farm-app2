"use client";

import { ReferralLink } from "@/components/friends/ReferralLink";

export default function FriendsPage() {
  return (
    <main className="animate-rise space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-barn-hay">Друзья</h1>
        <p className="mt-1 text-sm text-barn-cream/70">
          Приглашай через @CoinBarnBot · 5% с farm claim
        </p>
      </div>
      <ReferralLink />
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-barn-cream/50">
          Лидерборд
        </h2>
        <p className="mt-3 text-sm text-barn-cream/60">Подключи API — топ по total_earned.</p>
      </section>
    </main>
  );
}
