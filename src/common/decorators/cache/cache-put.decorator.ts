// cacheable.decorator.ts

import { RedisAccessor } from '@/common/providers/redis.accessor';
import { generateKey } from '@/sharded/utils/redis.util';
import { RedisConfig } from '@/common/configs/redis.config';
import { CacheOptions } from '@/common/decorators/cache/types';



export function CachePut(options: CacheOptions) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const redisClient = RedisAccessor.getRedis();
      const finalKey = generateKey(options.key as string, args);
      const cachedValue = await redisClient.get(finalKey);
      if (cachedValue) {
        return JSON.parse(cachedValue);
      }
      const result = await originalMethod.apply(this, args);
      await redisClient.set(finalKey, JSON.stringify(result ?? ''), {
        EX: options.ttl || RedisConfig.DEFAULT_TTL,
      });
      return result;
    };

    return descriptor;
  };
}