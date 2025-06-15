// api-rate-limiter.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiRateLimiterInterceptor implements NestInterceptor {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const key = 'rate-limit:' + context.switchToHttp().getRequest().ip;

    // console.log(key);

    const currentRequestCount = await this.redis.incr(key);

    if (currentRequestCount === 1) {
      // 设置 key 的超时时间
      await this.redis.expire(key, 60); // 限流周期为 60 秒
    }

    if (currentRequestCount > 10) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    return next.handle().pipe(
      tap(() => {
        // 在响应完成后，你可以在这里执行一些操作。
      })
    );
  }
}
