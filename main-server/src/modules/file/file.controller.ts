import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/common/auth.decorator';
import { downloadResquestDto } from './dto/downloadRequest.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('MinioUpload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请放入文件', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      filename: `${Date.now()}-${file.originalname}`,
      buffer: file.buffer,
      mimeType: file.mimetype,
      size: file.size,
    };
    console.log(file.mimetype, file.size);
    // if (file.size > 1024 * 1024 * 5) {
    //   throw new HttpException('文件过于庞大', HttpStatus.BAD_REQUEST);
    // }
    await this.fileService.fileUpload(payload);
    return { message: '文件已发送至 MinIO 微服务对端处理' };
  }

  @Public()
  @Get('MinioDownload')
  async downloadFile(@Body() body: downloadResquestDto, @Res() res) {
    const { filename } = body;
    console.log('正在下载文件: ' + filename);
    if (!filename) {
      throw new HttpException('请输入正确文件名', HttpStatus.BAD_REQUEST);
    }
    try {
      const loadedFile = await this.fileService.fileDownload(filename);
      // 设置响应头，触发文件下载
      res.set({
        'Content-Type': loadedFile.contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(loadedFile.name)}"`,
        'Content-Length': loadedFile.buffer.length,
      });

      await res.end(loadedFile.buffer); // ⬅️ 把 Buffer 写入 HTTP 响应
    } catch (e) {
      console.log('下载失败' + e.message);
      throw new HttpException('下载失败', HttpStatus.BAD_REQUEST);
    } finally {
      console.log('下载成功');
    }
  }

  @Public()
  @Get('MinioFiles')
  async getMinioFiles() {
    const response = await this.fileService.getFiles();
    return { downloadable_files: response };
  }
}
