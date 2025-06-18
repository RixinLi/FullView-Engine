import { IsNotEmpty, IsString } from 'class-validator';

export class loadedFileDo {
  @IsNotEmpty()
  @IsString()
  contentType: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  buffer: Buffer;
}
