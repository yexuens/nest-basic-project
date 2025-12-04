import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DrizzleModule } from '@/database/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { LoginGuard } from '@/common/guards/login.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE, useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER, useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD, useClass: LoginGuard,
    },
  ],
})

export class AppModule {
}
