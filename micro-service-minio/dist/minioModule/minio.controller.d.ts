import { MinioService } from './minio.service';
import { RedisService } from 'src/redisModule/redis.service';
import { RedisKey } from 'ioredis';
export declare class MinioController {
    private readonly minioService;
    private readonly redisService;
    private loadedCachedFile;
    constructor(minioService: MinioService, redisService: RedisService);
    handleGetMinioFiles(): Promise<string[]>;
    handleGetMinioFileInfo(objectName: string): Promise<{
        name: string;
        size: number;
        contentType: any;
        lastModified: Date;
        etag: string;
    } | undefined>;
    handleRangeDownload(data: any): Promise<Buffer<ArrayBuffer>>;
    private streamToBuffer;
    handleDownload(data: any): Promise<Buffer<ArrayBufferLike> | null>;
    removeCacheOnRedis(key: RedisKey, totalChunks: number): Promise<void>;
    downloadCacheOnRedis(key: RedisKey, filename: string, chunkSize: number, totalChunks: number): Promise<void>;
    handleMinioPutFile(data: any): Promise<void>;
}
