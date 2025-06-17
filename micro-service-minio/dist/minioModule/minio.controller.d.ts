import { MinioService } from './minio.service';
export declare class MinioController {
    private readonly minioService;
    constructor(minioService: MinioService);
    handleMinioPutFile(data: {
        filename: string;
        buffer: string;
        mimeType: string;
    }): Promise<void>;
}
