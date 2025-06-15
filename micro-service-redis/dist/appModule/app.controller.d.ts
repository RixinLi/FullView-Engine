import { AppService } from './app.service';
import Redis from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';
export declare class AppController {
    private readonly appService;
    private readonly redis;
    constructor(appService: AppService, redis: Redis);
    redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto>;
}
