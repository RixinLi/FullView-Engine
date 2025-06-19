import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class mininFileInfoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsString()
  contentType: string;

  @IsNotEmpty()
  @IsString()
  lastModified: string;

  @IsNotEmpty()
  @IsString()
  etag: string;
}
