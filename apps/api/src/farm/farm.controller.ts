import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IsInt, Max, Min } from "class-validator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { FarmService } from "./farm.service";

class TapDto {
  @IsInt()
  @Min(1)
  @Max(50)
  count!: number;
}

@Controller("farm")
@UseGuards(JwtAuthGuard)
export class FarmController {
  constructor(private readonly farm: FarmService) {}

  @Get("state")
  state(@Req() req: { user: { userId: string } }) {
    return this.farm.getState(req.user.userId);
  }

  @Post("sync")
  sync(@Req() req: { user: { userId: string } }) {
    return this.farm.sync(req.user.userId);
  }

  @Post("tap")
  tap(@Req() req: { user: { userId: string } }, @Body() body: TapDto) {
    return this.farm.tap(req.user.userId, body.count);
  }

  @Post("claim")
  claim(@Req() req: { user: { userId: string } }) {
    return this.farm.claim(req.user.userId);
  }
}
