import { IsNotEmpty, IsObject } from 'class-validator';

export class RedisRequestDto {
  @IsObject()
  @IsNotEmpty()
  redis: Record<string, string>;
}

export class RedisResponseDto {
  @IsObject()
  @IsNotEmpty()
  redis: Record<string, string>;
}
