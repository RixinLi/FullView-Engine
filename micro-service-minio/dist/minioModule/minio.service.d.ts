export declare class MinioService {
    private readonly client;
    constructor();
    putFile(ObjectPath: string, buffer: Buffer): Promise<import("minio/dist/main/internal/type").UploadedObjectInfo>;
    putObject(bucketName: string, objectName: string, buffer: Buffer, size: number): Promise<import("minio/dist/main/internal/type").UploadedObjectInfo>;
}
