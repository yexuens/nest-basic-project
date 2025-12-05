// cache.accessor.ts

import { RedisClientType } from 'redis';

export class RedisAccessor {
  private static redis: RedisClientType;

  // 初始化时调用
  static setRedis(redis: RedisClientType) {
    this.redis = redis;
  }

  // 装饰器里调用
  static getRedis(): RedisClientType {
    if (!this.redis) {
      throw new Error('RedisClientType has not been initialized. Please check your AppModule.');
    }
    return this.redis;
  }
}