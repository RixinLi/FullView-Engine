import { RedisRequestDto, RedisResponseDto } from './app.dto';
import { RedisService } from './redis.service';
export declare class RedisController {
    private readonly redisService;
    constructor(redisService: RedisService);
    redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto>;
}
