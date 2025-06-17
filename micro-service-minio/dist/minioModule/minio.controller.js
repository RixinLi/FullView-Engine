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
exports.MinioController = void 0;
const common_1 = require("@nestjs/common");
const minio_service_1 = require("./minio.service");
const microservices_1 = require("@nestjs/microservices");
let MinioController = class MinioController {
    minioService;
    constructor(minioService) {
        this.minioService = minioService;
    }
    async handleMinioPutFile(data) {
        if (!data.mimeType) {
            console.log('文件类型不存在');
            return;
        }
        if (data.mimeType.startsWith('image/')) {
            data.filename = 'imgs/' + data.filename;
        }
        else if (data.mimeType.startsWith('video/')) {
            data.filename = 'videos/' + data.filename;
        }
        const Based64buffer = Buffer.from(data.buffer, 'base64');
        await this.minioService.putFile(data.filename, Based64buffer);
        console.log(`✅ 文件 ${data.filename} 已上传至 MinIO`);
    }
};
exports.MinioController = MinioController;
__decorate([
    (0, microservices_1.EventPattern)('minioPutFile'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MinioController.prototype, "handleMinioPutFile", null);
exports.MinioController = MinioController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [minio_service_1.MinioService])
], MinioController);
//# sourceMappingURL=minio.controller.js.map