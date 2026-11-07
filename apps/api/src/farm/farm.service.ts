import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { STARTING, farmShare, referralConfig } from "../common/economy.constants";
import { ReferralEarningSource } from "@prisma/client";

@Injectable()
export class FarmService {
  constructor(private readonly prisma: PrismaService) {}

  private regenEnergy(user: {
    energy: number;
    energyMax: number;
    energyUpdatedAt: Date;
  }) {
    const now = Date.now();
    const elapsedSec = Math.max(0, Math.floor((now - user.energyUpdatedAt.getTime()) / 1000));
    const energy = Math.min(
      user.energyMax,
      user.energy + elapsedSec * STARTING.energyRegenPerSec,
    );
    return { energy, energyUpdatedAt: new Date(now) };
  }

  private accrueStorage(user: {
    farmRatePerHour: number;
    storageCap: bigint;
    storageAccumulated: bigint;
    farmUpdatedAt: Date;
  }) {
    const now = Date.now();
    const elapsedH = Math.max(0, (now - user.farmUpdatedAt.getTime()) / 3_600_000);
    const raw = Math.floor(user.farmRatePerHour * elapsedH);
    const room = user.storageCap - user.storageAccumulated;
    const gained = BigInt(Math.min(raw, Number(room < 0n ? 0n : room)));
    return {
      storageAccumulated: user.storageAccumulated + gained,
      farmUpdatedAt: new Date(now),
    };
  }

  async getState(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const energy = this.regenEnergy(user);
    const storage = this.accrueStorage(user);
    return {
      coins: user.coins.toString(),
      totalEarned: user.totalEarned.toString(),
      energy: energy.energy,
      energyMax: user.energyMax,
      energyUpdatedAt: energy.energyUpdatedAt.toISOString(),
      farmRatePerHour: user.farmRatePerHour,
      storageCap: user.storageCap.toString(),
      storageAccumulated: storage.storageAccumulated.toString(),
      farmUpdatedAt: storage.farmUpdatedAt.toISOString(),
      coinsPerTap: user.coinsPerTap,
      tapEnergyCost: user.tapEnergyCost,
      storageFull: storage.storageAccumulated >= user.storageCap,
    };
  }

  async sync(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const energy = this.regenEnergy(user);
    const storage = this.accrueStorage(user);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        energy: energy.energy,
        energyUpdatedAt: energy.energyUpdatedAt,
        storageAccumulated: storage.storageAccumulated,
        farmUpdatedAt: storage.farmUpdatedAt,
      },
    });
    return this.getState(userId);
  }

  async tap(userId: string, count: number) {
    if (count < 1 || count > 50) {
      throw new BadRequestException("count must be 1..50");
    }
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const energy = this.regenEnergy(user);
    const storage = this.accrueStorage(user);
    const cost = user.tapEnergyCost * count;
    if (energy.energy < cost) {
      throw new BadRequestException("not enough energy");
    }
    const gain = BigInt(user.coinsPerTap * count);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        energy: energy.energy - cost,
        energyUpdatedAt: energy.energyUpdatedAt,
        storageAccumulated: storage.storageAccumulated,
        farmUpdatedAt: storage.farmUpdatedAt,
        coins: { increment: gain },
        totalEarned: { increment: gain },
      },
    });
    return this.getState(userId);
  }

  async claim(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const energy = this.regenEnergy(user);
    const storage = this.accrueStorage(user);
    const claimed = storage.storageAccumulated;
    if (claimed <= 0n) {
      throw new BadRequestException("nothing to claim");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        energy: energy.energy,
        energyUpdatedAt: energy.energyUpdatedAt,
        storageAccumulated: 0n,
        farmUpdatedAt: storage.farmUpdatedAt,
        coins: { increment: claimed },
        totalEarned: { increment: claimed },
      },
    });

    // 5% of farm claim only → referrer
    if (user.referredByUserId) {
      const cfg = referralConfig();
      const share =
        cfg.sharePercent === 5 ? farmShare(claimed) : (claimed * BigInt(cfg.sharePercent)) / 100n;
      if (share > 0n) {
        await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: user.referredByUserId },
            data: {
              coins: { increment: share },
              // referral share does not inflate invitee's total; inviter balance only
            },
          }),
          this.prisma.referralEarning.create({
            data: {
              inviterId: user.referredByUserId,
              inviteeId: userId,
              source: ReferralEarningSource.farm_claim,
              baseAmount: claimed,
              shareAmount: share,
            },
          }),
        ]);
      }
    }

    return this.getState(userId);
  }
}
