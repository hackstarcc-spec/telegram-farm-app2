import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { referralLink, referralConfig } from "../common/economy.constants";

@Injectable()
export class ReferralsService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const inviteCount = await this.prisma.referral.count({ where: { inviterId: userId } });
    const earnings = await this.prisma.referralEarning.aggregate({
      where: { inviterId: userId },
      _sum: { shareAmount: true },
    });
    const cfg = referralConfig();
    return {
      link: referralLink(user.referralCode),
      inviteCount,
      totalEarnings: (earnings._sum.shareAmount ?? 0n).toString(),
      sharePercent: cfg.sharePercent,
      inviteBonus: cfg.inviteBonus,
      welcomeBonus: cfg.welcomeBonus,
    };
  }

  async list(userId: string, take = 50) {
    const rows = await this.prisma.referral.findMany({
      where: { inviterId: userId },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        invitee: {
          select: { id: true, username: true, firstName: true, createdAt: true },
        },
      },
    });
    return rows.map((r) => ({
      inviteeId: r.invitee.id,
      username: r.invitee.username,
      firstName: r.invitee.firstName,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}
