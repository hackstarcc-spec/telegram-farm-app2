import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ReferralsService } from "./referrals.service";

@Controller("referrals")
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}

  @Get("me")
  me(@Req() req: { user: { userId: string } }) {
    return this.referrals.me(req.user.userId);
  }

  @Get("list")
  list(@Req() req: { user: { userId: string } }) {
    return this.referrals.list(req.user.userId);
  }
}
