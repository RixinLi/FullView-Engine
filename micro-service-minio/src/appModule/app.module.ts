import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisCacheModule } from 'src/redisModule/redis.module';
import { MinioModule } from 'src/minioModule/minio.module';

@Module({
  imports: [RedisCacheModule, MinioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
