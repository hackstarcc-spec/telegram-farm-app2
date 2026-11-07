import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboard")
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboard: LeaderboardService) {}

  @Get()
  top(@Req() req: { user: { userId: string } }) {
    return this.leaderboard.top(req.user.userId);
  }
}
