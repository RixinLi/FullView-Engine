import { Module } from '@nestjs/common';
import { RedisCacheModule } from '../redis/redisCacheModule.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiRateLimiterInterceptor } from './ApiRateLimitInterceptor.utils';
import { MicroserviceModule } from 'src/microservices/microsever.config';

@Module({
  imports: [RedisCacheModule, MicroserviceModule],
  providers: [ApiRateLimiterInterceptor],
  exports: [ApiRateLimiterInterceptor],
})
export class InterceptorModule {}
