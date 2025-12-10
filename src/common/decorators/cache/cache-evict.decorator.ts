import { CacheOptions } from '@/common/decorators/cache/types';
import { RedisAccessor } from '@/common/providers/redis.accessor';
import { generateKey } from '@/sharded/utils/redis.util';

export function CacheEvict(options: CacheOptions) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const redisClient = RedisAccessor.getRedis();
      const finalKey = generateKey(options.key, args);
      const result = await originalMethod.apply(this, args);
      await redisClient.del(finalKey);
      return result;
    };

    return descriptor;
  };
}
