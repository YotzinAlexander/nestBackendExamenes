import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Agregar estas lineas para el Validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT);
  logger.log(`App running in port ${process.env.PORT}`);
}
bootstrap();
