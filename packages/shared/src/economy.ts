/** Economy v1 constants (server is source of truth; client uses for UI previews). */

export const BOT_USERNAME = "CoinBarnBot";

export const STARTING = {
  coins: 0,
  energy: 100,
  energyMax: 100,
  storageCap: 5000,
  farmRatePerHour: 100,
  coinsPerTap: 1,
  tapEnergyCost: 1,
  energyRegenPerSec: 1,
} as const;

export const BOOST_MAX_LEVEL = 10;

export const BOOST_DEFS = {
  farm_speed: {
    code: "farm_speed",
    kind: "farm_speed" as const,
    name: "Скорость фарма",
    description: "+50 к farm_rate_per_hour за уровень",
    basePrice: 1000,
    priceGrowth: 1.5,
    effectPerLevel: 50,
    maxLevel: BOOST_MAX_LEVEL,
  },
  storage: {
    code: "storage",
    kind: "storage_cap" as const,
    name: "Хранилище",
    description: "+5000 к storage_cap за уровень",
    basePrice: 500,
    priceGrowth: 1.5,
    effectPerLevel: 5000,
    maxLevel: BOOST_MAX_LEVEL,
  },
  energy_max: {
    code: "energy_max",
    kind: "energy_max" as const,
    name: "Энергия",
    description: "+100 к energy_max за уровень",
    basePrice: 800,
    priceGrowth: 1.5,
    effectPerLevel: 100,
    maxLevel: BOOST_MAX_LEVEL,
  },
} as const;

/** Price to buy level L (1..10): ceil(base * 1.5^(L-1)) */
export function boostPrice(basePrice: number, level: number): number {
  return Math.ceil(basePrice * Math.pow(1.5, level - 1));
}

export const REFERRAL = {
  /** % of friend's farm claim only (not taps). */
  sharePercent: 5,
  inviteBonus: 500,
  welcomeBonus: 200,
  botUsername: BOT_USERNAME,
} as const;

export function referralLink(referralCode: string): string {
  return `https://t.me/${REFERRAL.botUsername}?start=ref_${referralCode}`;
}

/** Daily streak: calendar day in UTC. Reward day d: min(floor(100 * 1.5^(d-1)), 5000) */
export const DAILY = {
  timezone: "UTC" as const,
  baseReward: 100,
  growth: 1.5,
  cap: 5000,
} as const;

export function dailyReward(dayIndex: number): number {
  const d = Math.max(1, dayIndex);
  return Math.min(Math.floor(DAILY.baseReward * Math.pow(DAILY.growth, d - 1)), DAILY.cap);
}

export function farmShare(claimedAmount: number | bigint): bigint {
  const n = typeof claimedAmount === "bigint" ? claimedAmount : BigInt(claimedAmount);
  return (n * BigInt(REFERRAL.sharePercent)) / 100n;
}
