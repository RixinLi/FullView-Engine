import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/common/auth.decorator';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请放入文件', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      filename: `${Date.now()}-${file.originalname}`,
      buffer: file.buffer.toString('base64'),
      MimeType: file.mimetype,
    };
    await this.fileService.fileUpload(payload);
    return { message: '文件已发送至 MinIO 服务处理' };
  }
}
