import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  role: string;
}
