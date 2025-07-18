// redis.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      options: {
        host: 'localhost', // Redis 服务器地址
        port: 6379, // Redis 端口
        db: 1, // 如果你需要使用特定的数据库的话
      },
      type: 'single',
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCacheModule {}
