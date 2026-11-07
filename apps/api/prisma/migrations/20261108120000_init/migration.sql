-- CreateEnum
CREATE TYPE "BoostKind" AS ENUM ('farm_speed', 'storage_cap', 'energy_per_tap', 'energy_max');

-- CreateEnum
CREATE TYPE "TaskKind" AS ENUM ('daily', 'channel_subscribe', 'invite_friends', 'one_time');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('available', 'completed', 'claimed');

-- CreateEnum
CREATE TYPE "ReferralEarningSource" AS ENUM ('farm_claim', 'tap', 'other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegram_user_id" BIGINT NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "language_code" TEXT,
    "photo_url" TEXT,
    "coins" BIGINT NOT NULL DEFAULT 0,
    "total_earned" BIGINT NOT NULL DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "energy_max" INTEGER NOT NULL DEFAULT 100,
    "energy_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "farm_rate_per_hour" INTEGER NOT NULL DEFAULT 100,
    "storage_cap" BIGINT NOT NULL DEFAULT 5000,
    "storage_accumulated" BIGINT NOT NULL DEFAULT 0,
    "farm_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tap_energy_cost" INTEGER NOT NULL DEFAULT 1,
    "coins_per_tap" INTEGER NOT NULL DEFAULT 1,
    "referred_by_user_id" TEXT,
    "referral_code" TEXT NOT NULL,
    "daily_streak" INTEGER NOT NULL DEFAULT 0,
    "last_daily_claim_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boosts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "BoostKind" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_level" INTEGER NOT NULL,
    "base_price" BIGINT NOT NULL,
    "price_growth" DOUBLE PRECISION NOT NULL,
    "effect_per_level" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_boosts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "boost_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_boosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "TaskKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reward_coins" BIGINT NOT NULL,
    "payload" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'available',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "claimed_at" TIMESTAMP(3),
    "period_key" TEXT,

    CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "invitee_id" TEXT NOT NULL,
    "bonus_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_earnings" (
    "id" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "invitee_id" TEXT NOT NULL,
    "source" "ReferralEarningSource" NOT NULL,
    "base_amount" BIGINT NOT NULL,
    "share_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reward_tiers" (
    "day_index" INTEGER NOT NULL,
    "reward_coins" BIGINT NOT NULL,
    "label" TEXT,

    CONSTRAINT "daily_reward_tiers_pkey" PRIMARY KEY ("day_index")
);

-- CreateTable
CREATE TABLE "daily_reward_claims" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day_index" INTEGER NOT NULL,
    "reward_coins" BIGINT NOT NULL,
    "claim_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_reward_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");

-- CreateIndex
CREATE INDEX "users_total_earned_idx" ON "users"("total_earned" DESC);

-- CreateIndex
CREATE INDEX "users_referred_by_user_id_idx" ON "users"("referred_by_user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "boosts_code_key" ON "boosts"("code");

-- CreateIndex
CREATE INDEX "boosts_kind_sort_order_idx" ON "boosts"("kind", "sort_order");

-- CreateIndex
CREATE INDEX "user_boosts_boost_id_idx" ON "user_boosts"("boost_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_boosts_user_id_boost_id_key" ON "user_boosts"("user_id", "boost_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_code_key" ON "tasks"("code");

-- CreateIndex
CREATE INDEX "tasks_kind_is_active_idx" ON "tasks"("kind", "is_active");

-- CreateIndex
CREATE INDEX "user_tasks_user_id_status_idx" ON "user_tasks"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_tasks_user_id_task_id_period_key_key" ON "user_tasks"("user_id", "task_id", "period_key");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_invitee_id_key" ON "referrals"("invitee_id");

-- CreateIndex
CREATE INDEX "referrals_inviter_id_idx" ON "referrals"("inviter_id");

-- CreateIndex
CREATE INDEX "referral_earnings_inviter_id_created_at_idx" ON "referral_earnings"("inviter_id", "created_at");

-- CreateIndex
CREATE INDEX "referral_earnings_invitee_id_created_at_idx" ON "referral_earnings"("invitee_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reward_claims_user_id_claim_date_key" ON "daily_reward_claims"("user_id", "claim_date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_user_id_fkey" FOREIGN KEY ("referred_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_boosts" ADD CONSTRAINT "user_boosts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_boosts" ADD CONSTRAINT "user_boosts_boost_id_fkey" FOREIGN KEY ("boost_id") REFERENCES "boosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reward_claims" ADD CONSTRAINT "daily_reward_claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
