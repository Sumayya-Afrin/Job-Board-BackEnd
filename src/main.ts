/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads into DTO instances
    whitelist: true, // Strip out properties that do not belong to the DTO
    forbidNonWhitelisted: true, // Throw an error if extra properties are found
    skipMissingProperties: false, // Fail if properties are missing in the request body
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
