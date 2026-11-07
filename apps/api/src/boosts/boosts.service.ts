import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { boostPrice, STARTING } from "../common/economy.constants";
import { BoostKind } from "@prisma/client";

@Injectable()
export class BoostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const boosts = await this.prisma.boost.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const levels = await this.prisma.userBoost.findMany({ where: { userId } });
    const byBoost = new Map(levels.map((l) => [l.boostId, l.level]));

    return boosts.map((b) => {
      const level = byBoost.get(b.id) ?? 0;
      const nextLevel = level + 1;
      const nextPrice =
        nextLevel <= b.maxLevel
          ? boostPrice(Number(b.basePrice), nextLevel)
          : null;
      return {
        id: b.id,
        code: b.code,
        kind: b.kind,
        name: b.name,
        description: b.description,
        level,
        maxLevel: b.maxLevel,
        effectPerLevel: b.effectPerLevel,
        nextPrice,
      };
    });
  }

  async buy(userId: string, boostId: string) {
    const boost = await this.prisma.boost.findUniqueOrThrow({ where: { id: boostId } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const ub = await this.prisma.userBoost.findUnique({
      where: { userId_boostId: { userId, boostId } },
    });
    const level = ub?.level ?? 0;
    if (level >= boost.maxLevel) {
      throw new BadRequestException("max level reached");
    }
    const nextLevel = level + 1;
    const price = BigInt(boostPrice(Number(boost.basePrice), nextLevel));
    if (user.coins < price) {
      throw new BadRequestException("not enough coins");
    }

    const data: {
      farmRatePerHour?: number;
      storageCap?: bigint;
      energyMax?: number;
    } = {};
    if (boost.kind === BoostKind.farm_speed) {
      data.farmRatePerHour = STARTING.farmRatePerHour + Math.round(boost.effectPerLevel) * nextLevel;
    } else if (boost.kind === BoostKind.storage_cap) {
      data.storageCap = BigInt(STARTING.storageCap) + BigInt(Math.round(boost.effectPerLevel) * nextLevel);
    } else if (boost.kind === BoostKind.energy_max) {
      data.energyMax = STARTING.energyMax + Math.round(boost.effectPerLevel) * nextLevel;
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { coins: { decrement: price }, ...data },
      }),
      this.prisma.userBoost.upsert({
        where: { userId_boostId: { userId, boostId } },
        create: { userId, boostId, level: nextLevel, purchasedAt: new Date() },
        update: { level: nextLevel, purchasedAt: new Date() },
      }),
    ]);

    return this.list(userId);
  }
}
