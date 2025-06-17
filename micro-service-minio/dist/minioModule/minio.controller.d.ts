import { MinioService } from './minio.service';
import { RedisService } from 'src/redisModule/redis.service';
export declare class MinioController {
    private readonly minioService;
    private readonly redisService;
    constructor(minioService: MinioService, redisService: RedisService);
    handleMinioPutFile(data: any): Promise<void>;
}
