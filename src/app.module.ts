import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DrizzleModule } from '@/data/database/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ZodExceptionFilter } from '@/common/filters/zod-exception.filter';
import { LoginGuard } from '@/common/guards/login.guard';
import { RedisModule } from '@/data/redis/redis.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { RedisAccessor } from '@/common/accessors/redis.accessor';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import type { RedisClientType } from 'redis';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, DrizzleModule, RedisModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE, useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR, useClass: TransformInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR, useClass: CacheableInterceptor,
    // },
    {
      provide: APP_FILTER, useClass: ZodExceptionFilter,
    },
    {
      provide: APP_GUARD, useClass: LoginGuard,
    },
  ],
})

export class AppModule implements OnModuleInit {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType,
  ) {
  }

  onModuleInit() {
    RedisAccessor.setRedis(this.redis);
  }
}
