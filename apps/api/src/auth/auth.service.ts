import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { validateTelegramInitData } from "./telegram-initdata";
import { STARTING, referralConfig } from "../common/economy.constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginWithTelegram(initData: string) {
    const botToken = process.env.BOT_TOKEN ?? "";
    const maxAge = Number(process.env.INITDATA_MAX_AGE_SEC ?? 86400);
    const result = validateTelegramInitData(initData, botToken, maxAge);
    if (!result.ok) {
      throw new UnauthorizedException(result.reason);
    }

    const tgId = BigInt(String(result.user.id));
    const startParam = result.startParam;
    const ref = startParam?.startsWith("ref_") ? startParam.slice(4) : undefined;

    let user = await this.prisma.user.findUnique({ where: { telegramUserId: tgId } });
    if (!user) {
      const referralCode = randomBytes(6).toString("hex");
      let referredByUserId: string | undefined;
      if (ref) {
        const inviter = await this.prisma.user.findUnique({ where: { referralCode: ref } });
        if (inviter && inviter.telegramUserId !== tgId) {
          referredByUserId = inviter.id;
        }
      }

      const bonuses = referralConfig();
      user = await this.prisma.user.create({
        data: {
          telegramUserId: tgId,
          username: (result.user.username as string) ?? null,
          firstName: (result.user.first_name as string) ?? null,
          lastName: (result.user.last_name as string) ?? null,
          languageCode: (result.user.language_code as string) ?? null,
          photoUrl: (result.user.photo_url as string) ?? null,
          coins: BigInt(referredByUserId ? bonuses.welcomeBonus : STARTING.coins),
          totalEarned: BigInt(referredByUserId ? bonuses.welcomeBonus : 0),
          energy: STARTING.energy,
          energyMax: STARTING.energyMax,
          farmRatePerHour: STARTING.farmRatePerHour,
          storageCap: BigInt(STARTING.storageCap),
          coinsPerTap: STARTING.coinsPerTap,
          tapEnergyCost: STARTING.tapEnergyCost,
          referralCode,
          referredByUserId,
        },
      });

      if (referredByUserId) {
        await this.prisma.$transaction([
          this.prisma.referral.create({
            data: {
              inviterId: referredByUserId,
              inviteeId: user.id,
              bonusPaid: true,
            },
          }),
          this.prisma.user.update({
            where: { id: referredByUserId },
            data: {
              coins: { increment: BigInt(bonuses.inviteBonus) },
              totalEarned: { increment: BigInt(bonuses.inviteBonus) },
            },
          }),
        ]);
      }
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          username: (result.user.username as string) ?? user.username,
          firstName: (result.user.first_name as string) ?? user.firstName,
          lastName: (result.user.last_name as string) ?? user.lastName,
          languageCode: (result.user.language_code as string) ?? user.languageCode,
          photoUrl: (result.user.photo_url as string) ?? user.photoUrl,
        },
      });
    }

    const accessSecret =
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "dev-only-change-me";
    const accessTtl = process.env.JWT_ACCESS_TTL || "15m";
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, tid: String(user.telegramUserId) },
      { secret: accessSecret, expiresIn: accessTtl },
    );

    const refreshRaw = randomBytes(32).toString("hex");
    const refreshHash = createHash("sha256").update(refreshRaw).digest("hex");
    const refreshDays = 30;
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshHash,
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken: refreshRaw,
      user: {
        id: user.id,
        referralCode: user.referralCode,
        coins: user.coins.toString(),
      },
    };
  }
}
