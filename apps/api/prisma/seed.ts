import { PrismaClient, BoostKind, TaskKind } from "@prisma/client";
import { BOOST_DEFS, dailyReward } from "@coinbarn/shared";

const prisma = new PrismaClient();

async function main() {
  const boostRows = [
    {
      ...BOOST_DEFS.farm_speed,
      kind: BoostKind.farm_speed,
      sortOrder: 1,
    },
    {
      ...BOOST_DEFS.storage,
      kind: BoostKind.storage_cap,
      sortOrder: 2,
    },
    {
      ...BOOST_DEFS.energy_max,
      kind: BoostKind.energy_max,
      sortOrder: 3,
    },
  ];

  for (const b of boostRows) {
    await prisma.boost.upsert({
      where: { code: b.code },
      create: {
        code: b.code,
        kind: b.kind,
        name: b.name,
        description: b.description,
        maxLevel: b.maxLevel,
        basePrice: BigInt(b.basePrice),
        priceGrowth: b.priceGrowth,
        effectPerLevel: b.effectPerLevel,
        sortOrder: b.sortOrder,
        isActive: true,
      },
      update: {
        kind: b.kind,
        name: b.name,
        description: b.description,
        maxLevel: b.maxLevel,
        basePrice: BigInt(b.basePrice),
        priceGrowth: b.priceGrowth,
        effectPerLevel: b.effectPerLevel,
        sortOrder: b.sortOrder,
        isActive: true,
      },
    });
  }

  // Materialize daily reward tiers for first 30 days (formula capped at 5000).
  for (let day = 1; day <= 30; day++) {
    const reward = dailyReward(day);
    await prisma.dailyRewardTier.upsert({
      where: { dayIndex: day },
      create: {
        dayIndex: day,
        rewardCoins: BigInt(reward),
        label: `Day ${day}`,
      },
      update: {
        rewardCoins: BigInt(reward),
        label: `Day ${day}`,
      },
    });
  }

  const tasks = [
    {
      code: "daily_login",
      kind: TaskKind.daily,
      title: "Ежедневный вход",
      description: "Зайди в Mini App сегодня",
      rewardCoins: 50n,
      sortOrder: 1,
      payload: null,
    },
    {
      code: "subscribe_channel",
      kind: TaskKind.channel_subscribe,
      title: "Подписка на канал",
      description: "Подпишись на официальный канал CoinBarn",
      rewardCoins: 250n,
      sortOrder: 2,
      payload: { channelUsername: "@coinbarn" },
    },
    {
      code: "invite_3_friends",
      kind: TaskKind.invite_friends,
      title: "Пригласи 3 друзей",
      description: "Поделись реферальной ссылкой",
      rewardCoins: 500n,
      sortOrder: 3,
      payload: { inviteTarget: 3 },
    },
  ];

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { code: t.code },
      create: {
        code: t.code,
        kind: t.kind,
        title: t.title,
        description: t.description,
        rewardCoins: t.rewardCoins,
        sortOrder: t.sortOrder,
        payload: t.payload ?? undefined,
        isActive: true,
      },
      update: {
        kind: t.kind,
        title: t.title,
        description: t.description,
        rewardCoins: t.rewardCoins,
        sortOrder: t.sortOrder,
        payload: t.payload ?? undefined,
        isActive: true,
      },
    });
  }

  console.log("Seed OK: boosts, daily_reward_tiers (1–30), sample tasks");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
