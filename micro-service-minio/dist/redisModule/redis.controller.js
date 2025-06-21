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
exports.RedisController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const redis_service_1 = require("./redis.service");
let RedisController = class RedisController {
    redisService;
    constructor(redisService) {
        this.redisService = redisService;
    }
    async redisCacheSearch(key) {
        const val = await this.redisService.getValue(key);
        if (val === null) {
            throw new microservices_1.RpcException(`缓存失效,没找到键为${key}的值`);
        }
        return val;
    }
    async handleSetCache(data) {
        const { key, val, ttlTime, ttlUnit } = data;
        const retval = await this.redisService.setValue(key, val, ttlTime, ttlUnit);
        if (retval === null) {
            throw new microservices_1.RpcException(`缓存${key}:${val}失败`);
        }
        return retval;
    }
};
exports.RedisController = RedisController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'getCache' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "redisCacheSearch", null);
__decorate([
    (0, microservices_1.EventPattern)('setCache'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RedisController.prototype, "handleSetCache", null);
exports.RedisController = RedisController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisController);
//# sourceMappingURL=redis.controller.js.map