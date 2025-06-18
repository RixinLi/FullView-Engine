import { Injectable } from '@nestjs/common';
import mime from 'mime';
import { Client } from 'minio';
import { Readable } from 'stream';
import { minioConfig } from './minio.config';

@Injectable()
export class MinioService {
  private readonly client: Client;

  constructor() {
    this.client = new Client(minioConfig.minioClientConfig);
    this.client
      .listBuckets()
      .then((buckets) => {
        console.log('连接成功，当前 Buckets:');
        buckets.forEach((bucket) => {
          console.log(`- ${bucket.name}(创建时间：${bucket.creationDate})`);
        });
      })
      .catch((err) => {
        console.error('连接失败或获取 Buckets 出错：', err);
      });
  }

  // 获取所有Objects信息
  async findAllObjects() {
    console.log('显示所有可下载文件');

    const stream = await this.client.listObjects(
      minioConfig.bucketName,
      '',
      true,
    );

    const files: string[] = [];

    for await (const obj of stream) {
      files.push(obj.name); // 你可以根据 obj.name 或其他字段来收集
    }

    console.log(files);
    return files;
  }

  // 上传Object
  async putObject(
    bucketName: string,
    objectName: string,
    buffer: Buffer,
    size: number,
  ) {
    return this.client.putObject(bucketName, objectName, buffer, size);
  }

  // 获取Object的Info
  async getObjectInfo(objectName: string) {
    try {
      const stat = await this.client.statObject(
        minioConfig.bucketName,
        objectName,
      );
      return {
        name: objectName,
        size: stat.size,
        contentType: stat.metaData['content-type'],
        lastModified: stat.lastModified,
        etag: stat.etag,
      };
    } catch (err) {
      console.error('获取对象信息失败 文件不存在');
    }
  }

  // 获取Object的buffer
  async getObjectAsBuffer(objectName: string): Promise<Buffer> {
    const stream = await this.client.getObject(
      minioConfig.bucketName,
      objectName,
    );
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    console.log('已使用流式下载文件成功');
    return Buffer.concat(chunks);
  }
}
