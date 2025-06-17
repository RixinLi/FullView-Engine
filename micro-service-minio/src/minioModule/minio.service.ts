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

  //直接上传接收到的 buff
  async putFile(ObjectPath: string, buffer: Buffer) {
    //如果想两个端都存在文件，可以使用 fPutObject 逻辑更简单
    return this.client.putObject(minioConfig.bucketName, ObjectPath, buffer);
    //{ etag: '4889457ca823d079a800e4a5f427b353', versionId: null }
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
}
