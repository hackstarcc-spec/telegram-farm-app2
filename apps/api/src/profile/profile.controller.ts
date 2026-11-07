import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ProfileService } from "./profile.service";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get("me")
  me(@Req() req: { user: { userId: string } }) {
    return this.profile.me(req.user.userId);
  }

  @Post("daily-claim")
  dailyClaim(@Req() req: { user: { userId: string } }) {
    return this.profile.dailyClaim(req.user.userId);
  }
}
