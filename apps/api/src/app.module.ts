import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { FarmModule } from "./farm/farm.module";
import { BoostsModule } from "./boosts/boosts.module";
import { TasksModule } from "./tasks/tasks.module";
import { ReferralsModule } from "./referrals/referrals.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";
import { ProfileModule } from "./profile/profile.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    FarmModule,
    BoostsModule,
    TasksModule,
    ReferralsModule,
    LeaderboardModule,
    ProfileModule,
    HealthModule,
  ],
})
export class AppModule {}
