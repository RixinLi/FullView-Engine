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
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const minio_1 = require("minio");
const minio_config_1 = require("./minio.config");
let MinioService = class MinioService {
    client;
    constructor() {
        this.client = new minio_1.Client(minio_config_1.minioConfig.minioClientConfig);
        this.client
            .listBuckets()
            .then((buckets) => {
            console.log('连接成功，当前 Buckets:');
            buckets.forEach((bucket) => {
                console.log(`- ${bucket.name}(创建时间：${bucket.creationDate})`);
            });
        })
            .catch((err) => {
            console.error('连接失败或获取 Buckets 出错：', err);
        });
    }
    async findAllObjects() {
        console.log('显示所有可下载文件');
        const stream = await this.client.listObjects(minio_config_1.minioConfig.bucketName, '', true);
        const files = [];
        for await (const obj of stream) {
            files.push(obj.name);
        }
        console.log(files);
        return files;
    }
    async putObject(bucketName, objectName, buffer, size) {
        return this.client.putObject(bucketName, objectName, buffer, size);
    }
    async getObjectInfo(objectName) {
        try {
            const stat = await this.client.statObject(minio_config_1.minioConfig.bucketName, objectName);
            return {
                name: objectName,
                size: stat.size,
                contentType: stat.metaData['content-type'],
                lastModified: stat.lastModified,
                etag: stat.etag,
            };
        }
        catch (err) {
            console.error('获取对象信息失败 文件不存在');
        }
    }
    async getObjectAsBuffer(objectName) {
        const stream = await this.client.getObject(minio_config_1.minioConfig.bucketName, objectName);
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        console.log('已使用流式下载文件成功');
        return Buffer.concat(chunks);
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MinioService);
//# sourceMappingURL=minio.service.js.map