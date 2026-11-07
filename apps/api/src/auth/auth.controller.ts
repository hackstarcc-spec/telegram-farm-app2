import { Body, Controller, Post } from "@nestjs/common";
import { IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";

class TelegramAuthDto {
  @IsString()
  @MinLength(1)
  initData!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("telegram")
  telegram(@Body() body: TelegramAuthDto) {
    return this.auth.loginWithTelegram(body.initData);
  }

  @Post("refresh")
  refresh() {
    return { ok: false, message: "TODO: implement refresh" };
  }

  @Post("logout")
  logout() {
    return { ok: true };
  }
}
