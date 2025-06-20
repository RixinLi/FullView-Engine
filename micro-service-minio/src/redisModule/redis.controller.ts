import { Controller, Get } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis, { RedisKey } from 'ioredis';
import { RedisService } from './redis.service';

@Controller()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @MessagePattern({ cmd: 'getCache' })
  async redisCacheSearch(key: RedisKey) {
    const val = this.redisService.getValue(key);
    if (val === null) {
      throw new RpcException(`缓存失效,没找到键为${key}的值`);
    }
    return val;
  }

  @EventPattern('setCache')
  async handleSetCache() {}
}
