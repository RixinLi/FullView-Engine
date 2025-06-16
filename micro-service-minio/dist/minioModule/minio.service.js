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
let MinioService = class MinioService {
    client;
    constructor() {
        this.client = new minio_1.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'minioadmin',
            secretKey: 'minioadmin',
        });
        this.client
            .listBuckets()
            .then((buckets) => {
            console.log('连接成功，当前 Buckets：');
            buckets.forEach((bucket) => {
                console.log(`- ${bucket.name}（创建时间：${bucket.creationDate}）`);
            });
        })
            .catch((err) => {
            console.error('连接失败或获取 Buckets 出错：', err);
        });
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MinioService);
//# sourceMappingURL=minio.service.js.map