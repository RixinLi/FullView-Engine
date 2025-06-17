import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FileService {
  constructor(@Inject('MINIO_SERVICE') private minioClient: ClientProxy) {}

  async fileUpload(Payload) {
    const { filename, buffer, mimeType, size } = Payload;

    // 使用分片上传
    const chunkSize = 1024 * 1024 * 2; // 2MB
    const totalChunks = Math.ceil(size / chunkSize);
    const streamId = `${filename}-${Date.now()}`;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = buffer.slice(i * chunkSize, (i + 1) * chunkSize);
      await this.minioClient.emit('minioPutFileChunk', {
        streamId,
        chunkIndex: i,
        totalChunks,
        chunk,
        filename,
        mimeType,
        isLast: i === totalChunks - 1,
      });
      console.log('已发送' + streamId + '的chunk: ' + i);
    }

    return { status: 'upload_started', streamId };
  }
}
