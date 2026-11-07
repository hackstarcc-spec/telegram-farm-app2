import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN;
  if (!corsOrigin) {
    console.warn(
      "[coinbarn] CORS_ORIGIN is unset — refusing open CORS. Set to your Vercel Mini App origin.",
    );
  }

  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(",").map((s) => s.trim()) : false,
    credentials: true,
  });

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`CoinBarn API listening on :${port}`);
}

bootstrap();
