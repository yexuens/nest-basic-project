// cacheable.decorator.ts

import { RedisAccessor } from '@/common/accessors/redis.accessor';

interface CacheableOptions {
  ttl: number;
  key: string | ((...args: any[]) => string);
  constantKey?: boolean;
}

export function Cacheable(options: CacheableOptions) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      // 1. 【变化】不再从 this (Service实例) 获取，而是从静态类获取
      const redisClient = RedisAccessor.getRedis();

      // 2. 生成 Key (逻辑不变)
      let finalKey = '';
      if (options.constantKey) {
        finalKey = options.key as string;
      } else if (typeof options.key === 'function') {
        finalKey = options.key(...args);
      } else {
        const argsKey = args.map(a =>
          typeof a === 'object' ? JSON.stringify(a) : a,
        ).join(':');
        finalKey = `${options.key}:${argsKey}`;
      }

      // 3. 查缓存
      const cachedValue = await redisClient.get(finalKey);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }

      // 4. 执行原方法
      const result = await originalMethod.apply(this, args);

      // 5. 写缓存
      if (result !== undefined && result !== null) {
        await redisClient.set(finalKey, JSON.stringify(result), {
          EX: options.ttl || 60 * 10,
        });
      }

      return result;
    };

    return descriptor;
  };
}