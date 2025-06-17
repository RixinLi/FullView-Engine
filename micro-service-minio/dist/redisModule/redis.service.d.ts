import Redis from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto>;
}
