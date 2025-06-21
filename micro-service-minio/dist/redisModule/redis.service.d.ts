import Redis, { RedisKey } from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    setBuffer(key: RedisKey, buffer: Buffer): Promise<void>;
    getBuffer(key: RedisKey): Promise<Buffer | null>;
    del(key: RedisKey): Promise<void>;
    getValue(key: RedisKey): Promise<Object | null>;
    setValue(key: RedisKey, val: Object, ttlTime: number, ttlUnit: string): Promise<"OK">;
}
