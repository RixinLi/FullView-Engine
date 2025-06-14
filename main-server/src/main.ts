import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  // await AppDataSource.initialize();
  // console.log('🚀 Database connected successfully');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appConfig.port);
  console.log(`🚀 Server running on port ${appConfig.port}`);
}
bootstrap();
