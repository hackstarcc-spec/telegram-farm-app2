/** Re-export shared economy; env can override referral bonuses at runtime. */
export {
  STARTING,
  BOOST_DEFS,
  BOOST_MAX_LEVEL,
  REFERRAL,
  DAILY,
  boostPrice,
  dailyReward,
  farmShare,
  referralLink,
  BOT_USERNAME,
} from "@coinbarn/shared";

export function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function referralConfig() {
  return {
    sharePercent: envInt("REF_SHARE_PERCENT", 5),
    inviteBonus: envInt("REF_INVITE_BONUS", 500),
    welcomeBonus: envInt("REF_WELCOME_BONUS", 200),
  };
}
