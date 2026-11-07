"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/farm", label: "Фарм" },
  { href: "/boosts", label: "Бусты" },
  { href: "/tasks", label: "Задания" },
  { href: "/friends", label: "Друзья" },
  { href: "/profile", label: "Профиль" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#1a120c]/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-2">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`block rounded-lg px-1 py-2 text-center text-xs font-semibold transition ${
                  active ? "bg-barn-hay/20 text-barn-hay" : "text-barn-cream/60 hover:text-barn-cream"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
