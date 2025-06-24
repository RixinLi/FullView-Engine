"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const ioredis_1 = require("@nestjs-modules/ioredis");
const common_1 = require("@nestjs/common");
const ioredis_2 = require("ioredis");
let RedisService = class RedisService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    refreshTime = 3600;
    thresholdTime = 3600;
    async setBuffer(key, buffer) {
        await this.redis.set(key, buffer);
    }
    async getBuffer(key) {
        const result = await this.redis.getBuffer(key);
        return result;
    }
    async del(key) {
        await this.redis.del(key);
    }
    async getValue(key) {
        const val = await this.redis.get(key);
        if (val === null)
            return null;
        const ttlTime = await this.redis.ttl(key);
        if (ttlTime !== -1 && ttlTime < this.thresholdTime) {
            const lockKey = `lock:refresh:${key}`;
            const lockVal = Date.now().toString();
            const acquired = await this.redis.set(lockKey, lockVal, 'EX', 5, 'NX');
            if (acquired) {
                await this.redis.set(key, val, 'EX', this.refreshTime);
                if (lockVal === (await this.redis.get(lockKey))) {
                    await this.redis.del(lockKey);
                }
            }
        }
        return JSON.parse(val);
    }
    async setValue(key, val, ttlTime, ttlUnit) {
        const retval = await this.redis.set(key, JSON.stringify(val), 'EX', ttlTime);
        if (!retval) {
            throw new common_1.InternalServerErrorException(`缓存${key}:${val}失败`);
        }
        return retval;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map