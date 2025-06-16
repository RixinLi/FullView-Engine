import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // 使用messagePattern异步调用，然后再使用redis的异步处理
  @MessagePattern('redis')
  async redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto> {
    const { redis } = requestDto;

    // 并行存入 Redis
    await Promise.all(
      Object.entries(redis).map(([key, value]) => this.redis.set(key, value)),
    );

    // 从 Redis 获取所有值
    const resultEntries = await Promise.all(
      Object.keys(redis).map(async (key) => [key, await this.redis.get(key)]),
    );

    return { redis: Object.fromEntries(resultEntries) };
  }

  @MessagePattern('notifications.*')
  handleNotification(message: string) {
    console.log(`收到通知: ${message}`);
  }
}
