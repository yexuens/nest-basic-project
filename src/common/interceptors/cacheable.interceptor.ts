import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import { Reflector } from '@nestjs/core';
import { CacheOptions } from '@/common/decorators/cacheable.decorator';
import { CACHE_KEY_METADATA } from '@nestjs/common/cache';

@Injectable()
export class CacheableInterceptor implements NestInterceptor {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType, // 1. 注入 Redis
    private readonly reflector: Reflector,        // 2. 注入 Reflector 用于读取 @MyCache 的配置
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    // ---------------------------------------------------------
    // 1. 获取装饰器配置
    // ---------------------------------------------------------
    const handler = context.getHandler();
    const options = this.reflector.get<CacheOptions>(CACHE_KEY_METADATA, handler);

    // 如果该方法没有加 @MyCache 装饰器，直接放行，不做任何处理
    if (!options) {
      return next.handle();
    }

    // ---------------------------------------------------------
    // 2. 生成 Cache Key
    // ---------------------------------------------------------
    const request = context.switchToHttp().getRequest();
    // 自动生成策略：Key前缀 + 请求URL (包含查询参数)
    // 也就是：GET /users/1 和 GET /users/2 会生成不同的 Key
    const defaultKey = `cache:${request.method}:${request.url}`;
    const finalKey = options.key || defaultKey;

    // ---------------------------------------------------------
    // 3. 核心逻辑：查缓存 -> (有)返回 -> (无)执行 -> 存缓存 -> 返回
    // ---------------------------------------------------------

    // 因为 redis.get 是 Promise，需要用 from 转成 Observable 流
    return from(this.redis.get(finalKey)).pipe(
      switchMap((cachedData) => {
        // A. 缓存命中 (Cache Hit)
        if (cachedData) {
          console.log(`🚀 [Interceptor Hit] Key: ${finalKey}`);
          // 将字符串反序列化回 JSON 对象
          return of(JSON.parse(cachedData));
        }

        // B. 缓存未命中 (Cache Miss)
        // 继续执行后续的 Handler (Controller -> Service -> DB)
        return next.handle().pipe(
          tap(async (data) => {
            // 'tap' 操作符用于执行副作用（Side Effect），不改变流的数据
            console.log(`🐢 [Interceptor Miss] Key: ${finalKey}, 写入 Redis...`);
            if (data) {
              await this.redis.set(finalKey, JSON.stringify(data), {
                EX: options.ttl || 60,
              });
            }
          }),
        );
      }),
    );
  }
}