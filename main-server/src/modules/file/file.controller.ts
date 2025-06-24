import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/common/auth.decorator';
import { downloadResquestDto } from './dto/downloadRequest.dto';
import { Result } from 'src/common/result';

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
    // console.log(file.mimetype, file.size);
    // if (file.size > 1024 * 1024 * 5) {
    //   throw new HttpException('文件过于庞大', HttpStatus.BAD_REQUEST);
    // }
    try {
      await this.fileService.fileUpload(payload);
    } catch (e) {
      console.log(e);
      throw new HttpException('文件上传失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // upload成功后返回文件名
    return Result.success({ filename: payload.filename });
  }

  @Public()
  @Get('MinioDownloadByQuery')
  async downloadFileByQuery(@Query('filename') filename, @Res() res, @Req() req) {
    return await this.downloadFile({ filename: filename }, res, req);
  }

  @Public()
  @Get('MinioDownload')
  async downloadFile(@Body() body: downloadResquestDto, @Res() res, @Req() req) {
    const { filename } = body;
    console.log('正在下载文件: ' + filename);
    if (!filename) {
      throw new HttpException('请输入正确文件名', HttpStatus.BAD_REQUEST);
    }

    // 获取文件信息 中文件大小的信息 以便进行range下载合理性
    let fileInfo = await this.fileService.getFileInfo(filename);
    const totalSize = fileInfo.size;

    // 判断是否存在range头
    const rangeHeader: string = req.headers.range;

    // 如果存在解析
    if (rangeHeader) {
      // 解析Range, 格式：“bytes=start-end”
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1; //如果未指定结束位置返回结束位置
      if (start >= totalSize || end >= totalSize) {
        res.set('Content-Range', `bytes*/${totalSize}`);
        return res.status(406).send('请求不符合要求');
      }

      // 准备定义chunk的大小 发起请求
      const chunkSize = end - start + 1;
      // 改成调用支持fileDownloadRange的微服务接口
      const fileChunk: Buffer = await this.fileService.fileRangeDownload(filename, start, end);
      // console.log(fileChunk);

      // 设置http信息
      res.status(206);
      res.set({
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': chunkSize,
        'Content-Type': fileInfo.contentType,
        'Accept-Ranges': 'bytes',
      });
      return res.end(fileChunk);
    } else {
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
  }

  @Public()
  @Get('MinioFiles')
  async getMinioFiles() {
    const response = await this.fileService.getFiles();
    return { downloadable_files: response };
  }
}
