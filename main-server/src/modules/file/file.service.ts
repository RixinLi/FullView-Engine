import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FileService {
  constructor(@Inject('MINIO_SERVICE') private minioClient: ClientProxy) {}

  async fileUpload(Payload) {
    this.minioClient.emit('minioPutFile', Payload);
    return;
  }
}
