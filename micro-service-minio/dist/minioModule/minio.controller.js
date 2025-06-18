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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioController = void 0;
const common_1 = require("@nestjs/common");
const minio_service_1 = require("./minio.service");
const microservices_1 = require("@nestjs/microservices");
const minio_config_1 = require("./minio.config");
const redis_service_1 = require("../redisModule/redis.service");
const tempDir = '/tmp/uploads';
const streamCache = new Map();
let MinioController = class MinioController {
    minioService;
    redisService;
    loadedCachedFile = new Set();
    constructor(minioService, redisService) {
        this.minioService = minioService;
        this.redisService = redisService;
    }
    async handleGetMinioFiles() {
        console.log('接收到获取所有文件名称请求');
        return await this.minioService.findAllObjects();
    }
    async handleGetMinioFileInfo(objectName) {
        console.log(`接收到获取${objectName}文件信息请求`);
        return await this.minioService.getObjectInfo(objectName);
    }
    async handleDownload(data) {
        const { streamId, chunkIndex, chunkSize, totalChunks, filename, isLast } = data;
        const objectLists = await this.minioService.findAllObjects();
        if (!objectLists.includes(filename)) {
            throw new common_1.InternalServerErrorException(`Object ${filename} not found`);
        }
        console.log('正在分片下载文件');
        if (!this.loadedCachedFile.has(streamId)) {
            this.loadedCachedFile.add(streamId);
            await this.downloadCacheOnRedis(streamId, filename, totalChunks, chunkSize);
            console.log('文件已经先打入redis缓存');
        }
        const chunk = await this.redisService.getBuffer(streamId + ':' + chunkIndex);
        if (isLast) {
            this.removeCacheOnRedis(streamId, totalChunks);
            this.loadedCachedFile.delete(streamId);
        }
        return chunk;
    }
    async removeCacheOnRedis(key, totalChunks) {
        for (let i = 0; i < totalChunks; i++) {
            await this.redisService.del(key + ':' + i);
        }
    }
    async downloadCacheOnRedis(key, filename, chunkSize, totalChunks) {
        const buffer = await this.minioService.getObjectAsBuffer(filename);
        if (buffer.length != chunkSize * totalChunks) {
            throw new common_1.InternalServerErrorException(`缓存到redis上的文件大小与minio中文件的大小不匹配`);
        }
        for (let i = 0; i < totalChunks; i++) {
            const chunk = buffer.slice(i * chunkSize, (i + 1) * chunkSize);
            await this.redisService.setBuffer(key + ':' + i, chunk);
        }
    }
    async handleMinioPutFile(data) {
        const { streamId, chunkIndex, totalChunks, chunk, filename, mimeType, isLast, } = data;
        const key = streamId + ':' + chunkIndex;
        await this.redisService.setBuffer(key, Buffer.from(chunk));
        console.log(`setting chunk ${key}`);
        if (isLast) {
            const buffers = [];
            for (let i = 0; i < totalChunks; i++) {
                const curKey = streamId + ':' + i;
                const curChunk = await this.redisService.getBuffer(curKey);
                if (!curChunk) {
                    throw new common_1.InternalServerErrorException(`Missing chunk ${i}`);
                }
                buffers.push(curChunk);
                await this.redisService.del(curKey);
            }
            const fileBuffer = Buffer.concat(buffers);
            if (!mimeType) {
                console.log('文件类型不存在');
                return;
            }
            console.log(filename);
            let objectName = filename;
            if (mimeType.startsWith('image/')) {
                objectName = 'imgs/' + objectName;
            }
            else if (data.mimeType.startsWith('video/')) {
                objectName = 'videos/' + objectName;
            }
            await this.minioService.putObject(minio_config_1.minioConfig.bucketName, objectName, fileBuffer, fileBuffer.length);
            console.log(`✅ 文件 ${objectName} 已上传至 MinIO`);
        }
    }
};
exports.MinioController = MinioController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'GetMinioFiles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MinioController.prototype, "handleGetMinioFiles", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'GetMinioFileInfo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MinioController.prototype, "handleGetMinioFileInfo", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'download' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MinioController.prototype, "handleDownload", null);
__decorate([
    (0, microservices_1.EventPattern)('minioPutFileChunk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MinioController.prototype, "handleMinioPutFile", null);
exports.MinioController = MinioController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [minio_service_1.MinioService,
        redis_service_1.RedisService])
], MinioController);
//# sourceMappingURL=minio.controller.js.map