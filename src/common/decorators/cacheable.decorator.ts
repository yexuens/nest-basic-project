import { SetMetadata } from '@nestjs/common';

// 定义 Metadata 的 Key，用于在拦截器里读取
export const CACHE_KEY_METADATA = 'CACHE_KEY_METADATA';

// 定义参数接口
export interface CacheOptions {
  ttl: number;      // 过期时间 (秒)
  key?: string;     // (可选) 自定义 Redis Key，不填则自动生成
}

// 这是一个标准的 NestJS 装饰器，它将 options 存储在元数据中
export const Cacheable = (options: CacheOptions) => SetMetadata(CACHE_KEY_METADATA, options);