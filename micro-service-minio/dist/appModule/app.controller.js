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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const app_dto_1 = require("./app.dto");
const minio_service_1 = require("../minioModule/minio.service");
let AppController = class AppController {
    appService;
    minioService;
    redis;
    constructor(appService, minioService, redis) {
        this.appService = appService;
        this.minioService = minioService;
        this.redis = redis;
    }
    async redisKeyValue(requestDto) {
        const { redis } = requestDto;
        await Promise.all(Object.entries(redis).map(([key, value]) => this.redis.set(key, value)));
        const resultEntries = await Promise.all(Object.keys(redis).map(async (key) => [key, await this.redis.get(key)]));
        return { redis: Object.fromEntries(resultEntries) };
    }
    async handleMinioPutFile(data) {
        const buffer = Buffer.from(data.buffer, 'base64');
        await this.minioService.putFile(data.filename, buffer);
        console.log(`✅ 文件 ${data.filename} 已上传至 MinIO`);
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.MessagePattern)('redis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.RedisRequestDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "redisKeyValue", null);
__decorate([
    (0, microservices_1.EventPattern)('minioPutFile'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handleMinioPutFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(2, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [app_service_1.AppService,
        minio_service_1.MinioService,
        ioredis_2.default])
], AppController);
//# sourceMappingURL=app.controller.js.map