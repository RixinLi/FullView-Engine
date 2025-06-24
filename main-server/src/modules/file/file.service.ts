import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { loadedFileDo } from './do/loadedFile.do';
import { mininFileInfoDto } from './do/mininFileInfo.do';

@Injectable()
export class FileService {
  constructor(@Inject('MINIO_SERVICE') private minioClient: ClientProxy) {}

  //文件发现
  async getFiles() {
    const result = await firstValueFrom(this.minioClient.send({ cmd: 'GetMinioFiles' }, {}));
    return result;
  }

  // 文件信息
  async getFileInfo(filename: string): Promise<mininFileInfoDto> {
    const result: mininFileInfoDto = await firstValueFrom(
      this.minioClient.send({ cmd: 'GetMinioFileInfo' }, filename)
    );
    return result;
  }

  // 文件分片上传
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
    }

    return { status: 'upload_started', streamId };
  }

  // 文件range Buffer传输
  async fileRangeDownload(filename: string, start: number, end: number): Promise<Buffer> {
    const buffer = await firstValueFrom(
      this.minioClient.send({ cmd: 'rangeDownload' }, { filename, start, end })
    );
    return Buffer.from(buffer);
  }

  // 文件分片下载
  async fileDownload(filename: string): Promise<loadedFileDo> {
    const fileInfo = await this.getFileInfo(filename);
    const { name, size, contentType } = fileInfo;

    // 定义块大小 2MB
    const chunkSize = 1024 * 1024 * 2; // 2MB
    const totalChunks = Math.ceil(size / chunkSize);
    // console.log(size, chunkSize, totalChunks);
    const streamId = `${filename}-${Date.now()}`;

    // 开始接收chunks Buffer
    const chunks: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      // 根据文件大小开始分片得到chunk 发起新的EventMessage
      const chunk = await firstValueFrom(
        this.minioClient.send(
          { cmd: 'download' },
          {
            streamId: streamId,
            chunkIndex: i,
            chunkSize: chunkSize,
            totalChunks: totalChunks,
            filename: filename,
            isLast: i === totalChunks - 1,
          }
        )
      );
      chunks.push(Buffer.from(chunk));
    }
    const resdo: loadedFileDo = {
      contentType: contentType,
      name: name,
      buffer: Buffer.concat(chunks),
    };
    return resdo;
  }
}
