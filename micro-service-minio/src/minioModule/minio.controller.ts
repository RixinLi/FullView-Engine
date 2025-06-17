import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import * as fs from 'fs';
import { minioConfig } from './minio.config';
import { sign } from 'crypto';
import { RedisService } from 'src/redisModule/redis.service';
import { RedisKey } from 'ioredis';

const tempDir = '/tmp/uploads';
const streamCache = new Map();

@Controller()
export class MinioController {
  constructor(
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
  ) {}

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
    // if (!streamCache.has(streamId)) {
    //   streamCache.set(streamId, []);
    // }
    // // 分块放入
    // streamCache.get(streamId)[chunkIndex] = Buffer.from(chunk); // 尝试把数据转化为Buffer
    // console.log('收到' + streamId + '的chunk: ' + chunkIndex);

    // 使用redis缓存来保存片段
    const key: RedisKey = streamId + ':' + chunkIndex;
    await this.redisService.setBuffer(key, Buffer.from(chunk));
    console.log(`setting chunk ${key}`);

    // 完成接收后上传到Minio，判断是否是最后的chunk块
    if (isLast) {
      // 合并所有分片
      const buffers: Buffer[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const curKey = streamId + ':' + i;
        const curChunk = await this.redisService.getBuffer(curKey);
        if (!curChunk) {
          throw new InternalServerErrorException(`Missing chunk ${i}`);
        }
        buffers.push(curChunk);
        // 可选：删除已用的分片缓存
        await this.redisService.del(curKey);
      }
      const fileBuffer = Buffer.concat(buffers);

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
