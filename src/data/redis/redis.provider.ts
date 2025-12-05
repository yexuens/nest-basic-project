import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async () => {
    return await createClient()
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
  },
};