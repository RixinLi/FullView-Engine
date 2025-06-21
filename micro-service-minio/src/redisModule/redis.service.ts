import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setBuffer(key: RedisKey, buffer: Buffer) {
    // ioredis 没有 setBuffer 方法，直接用 set 即可，Buffer 会被自动处理
    await this.redis.set(key, buffer);
  }

  async getBuffer(key: RedisKey): Promise<Buffer | null> {
    const result = await this.redis.getBuffer(key);
    return result;
  }

  async del(key: RedisKey) {
    await this.redis.del(key);
  }

  async getValue(key: RedisKey): Promise<Object | null> {
    const val = await this.redis.get(key);
    if (val === null) return null;
    return JSON.parse(val);
  }

  async setValue(key: RedisKey, val: Object, ttlTime: number, ttlUnit: string) {
    const retval = await this.redis.set(
      key,
      JSON.stringify(val),
      'EX',
      ttlTime,
    );
    if (!retval) {
      throw new InternalServerErrorException(`缓存${key}:${val}失败`);
    }
    return retval;
  }

  // async hasKey(key: RedisKey): Promise<boolean> {
  //   const exists = await this.redis.exists(key);
  //   return exists === 1;
  // }
}
