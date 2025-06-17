import Redis, { RedisKey } from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto>;
    setBuffer(key: RedisKey, buffer: Buffer): Promise<void>;
    getBuffer(key: RedisKey): Promise<Buffer | null>;
    del(key: RedisKey): Promise<void>;
}
