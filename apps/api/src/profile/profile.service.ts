import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { dailyReward } from "../common/economy.constants";

function utcDateString(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function utcDayDiff(a: Date, b: Date): number {
  const a0 = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const b0 = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((b0 - a0) / 86_400_000);
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      coins: user.coins.toString(),
      totalEarned: user.totalEarned.toString(),
      farmRatePerHour: user.farmRatePerHour,
      storageCap: user.storageCap.toString(),
      dailyStreak: user.dailyStreak,
      lastDailyClaimAt: user.lastDailyClaimAt?.toISOString() ?? null,
      referralCode: user.referralCode,
    };
  }

  async dailyClaim(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const today = utcDateString();
    if (user.lastDailyClaimAt && utcDateString(user.lastDailyClaimAt) === today) {
      throw new BadRequestException("already claimed today (UTC)");
    }

    let streak = 1;
    if (user.lastDailyClaimAt) {
      const diff = utcDayDiff(user.lastDailyClaimAt, new Date());
      streak = diff === 1 ? user.dailyStreak + 1 : 1;
    }
    const reward = dailyReward(streak);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          dailyStreak: streak,
          lastDailyClaimAt: new Date(),
          coins: { increment: BigInt(reward) },
          totalEarned: { increment: BigInt(reward) },
        },
      }),
      this.prisma.dailyRewardClaim.create({
        data: {
          userId,
          dayIndex: streak,
          rewardCoins: BigInt(reward),
          claimDate: new Date(`${today}T00:00:00.000Z`),
        },
      }),
    ]);

    return { dayIndex: streak, rewardCoins: reward };
  }
}
