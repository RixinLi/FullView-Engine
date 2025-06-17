"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minioConfig = void 0;
exports.minioConfig = {
    minioClientConfig: {
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
    },
    bucketName: 'test',
    folder: {
        VIDEOS: 'videos',
        IMGS: 'imgs',
    },
};
//# sourceMappingURL=minio.config.js.map