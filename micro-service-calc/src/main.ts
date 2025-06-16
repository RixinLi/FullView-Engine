import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
        wildcards: true, // 允许使用通配符订阅
      },
    },
  );
  console.log('🚀 micro-service-cal running on port 30001');
  app.listen();
}
bootstrap();
