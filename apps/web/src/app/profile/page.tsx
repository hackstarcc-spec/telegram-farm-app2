"use client";

import { getTelegramWebApp } from "@/lib/telegram";

export default function ProfilePage() {
  const user = getTelegramWebApp().initDataUnsafe.user;
  return (
    <main className="animate-rise">
      <h1 className="font-display text-3xl font-bold text-barn-hay">Профиль</h1>
      <p className="mt-1 text-sm text-barn-cream/70">Daily streak (UTC) и статистика</p>
      <div className="mt-6 space-y-2">
        <p className="text-lg font-semibold">
          {user?.first_name ?? "Игрок"}{" "}
          {user?.username ? (
            <span className="text-sm font-normal text-barn-cream/50">@{user.username}</span>
          ) : null}
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-barn-hay px-4 py-2.5 text-sm font-bold text-barn-dusk"
        >
          Забрать daily (UTC)
        </button>
        <p className="text-xs text-barn-cream/50">
          Награда: day1=100, ×1.5, cap 5000 · сброс при пропуске
        </p>
      </div>
    </main>
  );
}
