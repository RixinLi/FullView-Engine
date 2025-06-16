import { Module } from '@nestjs/common';
import { MicroserviceModule } from 'src/microservices/microsever.config';
import { InterceptorModule } from 'src/utils/interceptor/interceptor.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [MicroserviceModule, InterceptorModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
