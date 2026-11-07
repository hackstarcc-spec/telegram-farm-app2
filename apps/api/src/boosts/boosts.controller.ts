import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BoostsService } from "./boosts.service";

@Controller("boosts")
@UseGuards(JwtAuthGuard)
export class BoostsController {
  constructor(private readonly boosts: BoostsService) {}

  @Get()
  list(@Req() req: { user: { userId: string } }) {
    return this.boosts.list(req.user.userId);
  }

  @Post(":boostId/buy")
  buy(@Req() req: { user: { userId: string } }, @Param("boostId") boostId: string) {
    return this.boosts.buy(req.user.userId, boostId);
  }
}
