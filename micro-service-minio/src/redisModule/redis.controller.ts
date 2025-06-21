import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
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

  // 获取缓存
  @MessagePattern({ cmd: 'getCache' })
  async redisCacheSearch(key: RedisKey) {
    const val = await this.redisService.getValue(key);
    if (val === null) {
      throw new RpcException(`缓存失效,没找到键为${key}的值`);
    }
    return val;
  }

  // 设置缓存
  @EventPattern('setCache')
  async handleSetCache(
    @Payload()
    data: {
      key: RedisKey;
      val: Object;
      ttlTime: number;
      ttlUnit: string;
    },
  ) {
    const { key, val, ttlTime, ttlUnit } = data;
    const retval = await this.redisService.setValue(key, val, ttlTime, ttlUnit);
    if (retval === null) {
      throw new RpcException(`缓存${key}:${val}失败`);
    }
    return retval;
  }

  // 删除缓存
  @EventPattern('delCache')
  async handleDelCache(@Payload() data: { key: RedisKey }) {
    try {
      await this.redisService.del(data.key);
    } catch (e) {
      console.log(e);
    }
  }
}
