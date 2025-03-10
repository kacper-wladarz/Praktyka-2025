import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({ origin: ['http://localhost:5173'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const message = Object.values(firstError.constraints || {})[0];
        return new BadRequestException({
          field: firstError.property,
          message: message,
        });
      },
    }),
  );

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
