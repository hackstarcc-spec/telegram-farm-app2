import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async top(userId: string, take = 50) {
    const rows = await this.prisma.user.findMany({
      orderBy: { totalEarned: "desc" },
      take,
      select: {
        id: true,
        username: true,
        firstName: true,
        totalEarned: true,
      },
    });
    const me = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { totalEarned: true },
    });
    const better = await this.prisma.user.count({
      where: { totalEarned: { gt: me.totalEarned } },
    });
    return {
      entries: rows.map((r, i) => ({
        rank: i + 1,
        userId: r.id,
        username: r.username,
        firstName: r.firstName,
        totalEarned: r.totalEarned.toString(),
      })),
      myRank: better + 1,
    };
  }
}
