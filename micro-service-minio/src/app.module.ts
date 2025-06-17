import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/redisModule/redis.module';
import { MinioModule } from 'src/minioModule/minio.module';

@Module({
  imports: [RedisCacheModule, MinioModule],
})
export class AppModule {}
