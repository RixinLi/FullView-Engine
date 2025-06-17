import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 使用messagePattern异步调用，然后再使用redis的异步处理
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
}
