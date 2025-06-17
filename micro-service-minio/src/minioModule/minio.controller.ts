import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import * as fs from 'fs';
import { minioConfig } from './minio.config';
import { sign } from 'crypto';

const tempDir = '/tmp/uploads';
const streamCache = new Map();

@Controller()
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @EventPattern('minioPutFileChunk')
  async handleMinioPutFile(data) {
    // 解析对端的data
    const {
      streamId,
      chunkIndex,
      totalChunks,
      chunk,
      filename,
      mimeType,
      isLast,
    } = data;

    // 初始化临时缓存
    if (!streamCache.has(streamId)) {
      streamCache.set(streamId, []);
    }
    // 分块放入
    streamCache.get(streamId)[chunkIndex] = Buffer.from(chunk); // 尝试把数据转化为Buffer
    console.log('收到' + streamId + '的chunk: ' + chunkIndex);

    // 根据mimeType文件类型给文件打上前缀文件夹
    if (!mimeType) {
      console.log('文件类型不存在');
      return;
    }
    let objectName = filename;
    if (mimeType.startsWith('image/')) {
      objectName = 'imgs/' + objectName;
    } else if (data.mimeType.startsWith('video/')) {
      objectName = 'videos/' + objectName;
    }

    // 完成接收后上传到Minio，判断是否是最后的chunk块
    if (isLast) {
      const buffers = streamCache.get(streamId);
      const fileBuffer = Buffer.concat(buffers);
      streamCache.delete(streamId);
      // 上传到MinIO
      await this.minioService.putObject(
        minioConfig.bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
      );
      console.log(`✅ 文件 ${objectName} 已上传至 MinIO`);
    }
  }
}
