import { AppService } from './app.service';
import Redis from 'ioredis';
import { RedisRequestDto, RedisResponseDto } from './app.dto';
import { MinioService } from 'src/minioModule/minio.service';
export declare class AppController {
    private readonly appService;
    private readonly minioService;
    private readonly redis;
    constructor(appService: AppService, minioService: MinioService, redis: Redis);
    redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto>;
}
