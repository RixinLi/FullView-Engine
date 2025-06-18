import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import * as fs from 'fs';
import { minioConfig } from './minio.config';
import { sign } from 'crypto';
import { RedisService } from 'src/redisModule/redis.service';
import Redis, { RedisKey } from 'ioredis';

const tempDir = '/tmp/uploads';
const streamCache = new Map();

@Controller()
export class MinioController {
  private loadedCachedFile: Set<string> = new Set<string>();
  constructor(
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
  ) {}

  // 获取所有文件名称
  @MessagePattern({ cmd: 'GetMinioFiles' })
  async handleGetMinioFiles() {
    console.log('接收到获取所有文件名称请求');
    return await this.minioService.findAllObjects();
  }

  // 获取文件信息
  @MessagePattern({ cmd: 'GetMinioFileInfo' })
  async handleGetMinioFileInfo(objectName: string) {
    console.log(`接收到获取${objectName}文件信息请求`);
    return await this.minioService.getObjectInfo(objectName);
  }

  // 使用分片下载文件
  @MessagePattern({ cmd: 'download' })
  async handleDownload(data) {
    const { streamId, chunkIndex, chunkSize, totalChunks, filename, isLast } =
      data;

    const objectLists = await this.minioService.findAllObjects();
    if (!objectLists.includes(filename)) {
      // 文件不存在时的处理逻辑
      throw new InternalServerErrorException(`Object ${filename} not found`);
    }
    // 先判断是否已经缓存,否则先打如redis缓存
    if (!this.loadedCachedFile.has(streamId)) {
      console.log('正在分片下载文件');
      this.loadedCachedFile.add(streamId);
      await this.downloadCacheOnRedis(
        streamId,
        filename,
        chunkSize,
        totalChunks,
      );
      console.log('文件已经先打入redis缓存');
    }

    // 从redis中拿到对应的chunk buffer
    const chunk = await this.redisService.getBuffer(
      streamId + ':' + chunkIndex,
    );
    // 如果是最后一个chunk了，把缓存清了
    if (isLast) {
      // 清redis的缓存
      await this.removeCacheOnRedis(streamId, totalChunks);
      // 请set的streamId
      await this.loadedCachedFile.delete(streamId);
    }

    // 返回请求到的chunk
    return chunk;
  }

  //清理所有缓存
  async removeCacheOnRedis(key: RedisKey, totalChunks: number) {
    // 分片打入redis
    for (let i = 0; i < totalChunks; i++) {
      await this.redisService.del(key + ':' + i);
      // console.log('正在删除' + key + ':' + i);
    }
  }

  // 先将文件缓存到redis上
  async downloadCacheOnRedis(
    key: RedisKey,
    filename: string,
    chunkSize: number,
    totalChunks: number,
  ) {
    const buffer: Buffer = Buffer.from(
      await this.minioService.getObjectAsBuffer(filename),
    );

    // 分片打入redis
    for (let i = 0; i < totalChunks; i++) {
      const chunk = buffer.slice(i * chunkSize, (i + 1) * chunkSize);
      try {
        await this.redisService.setBuffer(key + ':' + i, chunk);
      } catch (e) {
        console.log('缓存失败');
      } finally {
        console.log(`缓存${key + ':' + i}成功`);
      }
    }
  }

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
    console.log(`上传缓存块chunk: ${key}`);

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
      console.log(filename);
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
        mimeType,
      );
      console.log(`✅ 文件 ${objectName} 已上传至 MinIO`);
    }
  }
}
