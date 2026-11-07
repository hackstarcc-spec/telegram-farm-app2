import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  list(@Req() req: { user: { userId: string } }) {
    return this.tasks.list(req.user.userId);
  }

  @Post(":taskId/check")
  check(@Req() req: { user: { userId: string } }, @Param("taskId") taskId: string) {
    return this.tasks.check(req.user.userId, taskId);
  }

  @Post(":taskId/claim")
  claim(@Req() req: { user: { userId: string } }, @Param("taskId") taskId: string) {
    return this.tasks.claim(req.user.userId, taskId);
  }
}
