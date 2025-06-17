import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @EventPattern('minioPutFile')
  async handleMinioPutFile(
    @Payload() data: { filename: string; buffer: string; mimeType: string },
  ) {
    // 根据mimeType文件类型给文件打上前缀文件夹
    if (!data.mimeType) {
      console.log('文件类型不存在');
      return;
    }

    if (data.mimeType.startsWith('image/')) {
      data.filename = 'imgs/' + data.filename;
    } else if (data.mimeType.startsWith('video/')) {
      data.filename = 'videos/' + data.filename;
    }
    const Based64buffer = Buffer.from(data.buffer, 'base64');
    await this.minioService.putFile(data.filename, Based64buffer);
    console.log(`✅ 文件 ${data.filename} 已上传至 MinIO`);
  }
}
