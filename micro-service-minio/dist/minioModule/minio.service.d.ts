export declare class MinioService {
    private readonly client;
    constructor();
    findAllObjects(): Promise<string[]>;
    putObject(bucketName: string, objectName: string, buffer: Buffer, size: number): Promise<import("minio/dist/main/internal/type").UploadedObjectInfo>;
    getObjectInfo(objectName: string): Promise<{
        name: string;
        size: number;
        contentType: any;
        lastModified: Date;
        etag: string;
    } | undefined>;
    getObjectAsBuffer(objectName: string): Promise<Buffer>;
}
