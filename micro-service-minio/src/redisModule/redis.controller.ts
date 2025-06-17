import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { MinioService } from 'src/minioModule/minio.service';
import { RedisRequestDto, RedisResponseDto } from './app.dto';
import { RedisService } from './redis.service';

@Controller()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  // 使用messagePattern异步调用，然后再使用redis的异步处理
  @MessagePattern('redis')
  async redisKeyValue(requestDto: RedisRequestDto): Promise<RedisResponseDto> {
    return this.redisService.redisKeyValue(requestDto);
  }
}
