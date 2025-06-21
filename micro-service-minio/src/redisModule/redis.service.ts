import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private readonly refreshTime: number = 3600;
  private readonly thresholdTime: number = 3600;

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

    // 刷新redis缓存的时间
    // 如果时间<600秒更新回
    const ttlTime = await this.redis.ttl(key);

    if (ttlTime !== -1 && ttlTime < this.thresholdTime) {
      // 加锁面对高并发
      const lockKey = `lock:refresh:${key}`;
      const lockVal = Date.now().toString();

      // 使用redis的 NX 来实现 NX: true 表示“只在 key 不存在时设置”，即加锁；
      const acquired = await this.redis.set(lockKey, lockVal, 'EX', 5, 'NX');
      if (acquired) {
        await this.redis.set(key, val, 'EX', this.refreshTime);
        //释放锁;
        if (lockVal === (await this.redis.get(lockKey))) {
          await this.redis.del(lockKey);
        }
      }
    }

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
