"use client";

import { useEffect, useState } from "react";
import type { BoostCatalogItem } from "@coinbarn/shared";
import { BOOST_DEFS, boostPrice } from "@coinbarn/shared";
import { BoostCard } from "@/components/boosts/BoostCard";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api-client";

const stub: BoostCatalogItem[] = Object.values(BOOST_DEFS).map((b, i) => ({
  id: String(i + 1),
  code: b.code,
  kind: b.kind,
  name: b.name,
  description: b.description,
  level: 0,
  maxLevel: b.maxLevel,
  effectPerLevel: b.effectPerLevel,
  nextPrice: boostPrice(b.basePrice, 1),
}));

export default function BoostsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<BoostCatalogItem[]>(stub);

  useEffect(() => {
    if (!token) return;
    void apiFetch<BoostCatalogItem[]>("/boosts", { token }).then(setItems).catch(() => undefined);
  }, [token]);

  return (
    <main className="animate-rise">
      <h1 className="font-display text-3xl font-bold text-barn-hay">Бусты</h1>
      <p className="mt-1 text-sm text-barn-cream/70">Прокачай фарм, склад и энергию (макс. 10)</p>
      <div className="mt-4">
        {items.map((b) => (
          <BoostCard
            key={b.id}
            name={b.name}
            description={b.description}
            level={b.level}
            maxLevel={b.maxLevel}
            nextPrice={b.nextPrice}
            onBuy={() => {
              if (!token) return;
              void apiFetch(`/boosts/${b.id}/buy`, { method: "POST", token }).then((list) =>
                setItems(list as BoostCatalogItem[]),
              );
            }}
          />
        ))}
      </div>
    </main>
  );
}
