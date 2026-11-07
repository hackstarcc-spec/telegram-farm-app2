export type BoostKind = "farm_speed" | "storage_cap" | "energy_per_tap" | "energy_max";

export type BoostCode = "farm_speed" | "storage" | "energy_max";

export type TaskKind = "daily" | "channel_subscribe" | "invite_friends" | "one_time";

export type TaskStatus = "available" | "completed" | "claimed";

export type ReferralEarningSource = "farm_claim" | "tap" | "other";

export interface UserPublic {
  id: string;
  telegramUserId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  coins: string;
  totalEarned: string;
  energy: number;
  energyMax: number;
  farmRatePerHour: number;
  storageCap: string;
  storageAccumulated: string;
  coinsPerTap: number;
  dailyStreak: number;
  referralCode: string;
}

export interface FarmState {
  coins: string;
  totalEarned: string;
  energy: number;
  energyMax: number;
  energyUpdatedAt: string;
  farmRatePerHour: number;
  storageCap: string;
  storageAccumulated: string;
  farmUpdatedAt: string;
  coinsPerTap: number;
  tapEnergyCost: number;
  storageFull: boolean;
}

export interface BoostCatalogItem {
  id: string;
  code: BoostCode;
  kind: BoostKind;
  name: string;
  description: string | null;
  level: number;
  maxLevel: number;
  effectPerLevel: number;
  nextPrice: number | null;
}

export interface TaskItem {
  id: string;
  code: string;
  kind: TaskKind;
  title: string;
  description: string | null;
  rewardCoins: string;
  status: TaskStatus;
  progress: number;
}

export interface ReferralSummary {
  link: string;
  inviteCount: number;
  totalEarnings: string;
  sharePercent: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string | null;
  firstName: string | null;
  totalEarned: string;
}
