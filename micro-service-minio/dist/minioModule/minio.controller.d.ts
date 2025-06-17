import { MinioService } from './minio.service';
export declare class MinioController {
    private readonly minioService;
    constructor(minioService: MinioService);
    handleMinioPutFile(data: any): Promise<void>;
}
