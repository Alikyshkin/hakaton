import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import rateLimit from 'express-rate-limit';

import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        message: "Too many requests"
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('VTB MORE.Tech Server Application')
      .setDescription('API of Nav2 solution')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
