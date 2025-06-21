import { RedisKey } from 'ioredis';
import { RedisService } from './redis.service';
export declare class RedisController {
    private readonly redisService;
    constructor(redisService: RedisService);
    redisCacheSearch(key: RedisKey): Promise<Object>;
    handleSetCache(data: {
        key: RedisKey;
        val: Object;
        ttlTime: number;
        ttlUnit: string;
    }): Promise<"OK">;
    handleDelCache(data: {
        key: RedisKey;
    }): Promise<void>;
}
