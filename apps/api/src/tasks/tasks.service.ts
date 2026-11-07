import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const utcDay = new Date().toISOString().slice(0, 10);
    const progress = await this.prisma.userTask.findMany({ where: { userId } });

    return tasks.map((t) => {
      const match = progress.find(
        (p) =>
          p.taskId === t.id &&
          (t.kind === "daily" ? p.periodKey === utcDay : !p.periodKey || p.periodKey === utcDay),
      );
      return {
        id: t.id,
        code: t.code,
        kind: t.kind,
        title: t.title,
        description: t.description,
        rewardCoins: t.rewardCoins.toString(),
        status: match?.status ?? "available",
        progress: match?.progress ?? 0,
      };
    });
  }

  async check(userId: string, taskId: string) {
    // Stub: channel subscribe would call Telegram getChatMember with BOT_TOKEN.
    void userId;
    void taskId;
    return { status: "completed", message: "TODO: verify via Bot API" };
  }

  async claim(userId: string, taskId: string) {
    void userId;
    void taskId;
    return { ok: false, message: "TODO: claim task reward" };
  }
}
