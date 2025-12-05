import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { NEED_LOGIN_METADATA } from '@/common/decorators/base/need-login.decorator';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import type { RedisClientType } from 'redis';
import { CacheKeys } from '@/common/utils/keys.util';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClientType, // 1. 注入 Redis
    private readonly reflector: Reflector,        // 2. 注入 Reflector 用于读取 @MyCache 的配置
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const needLogin = this.reflector.getAllAndOverride<boolean>(NEED_LOGIN_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!needLogin)
      return true;
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token)
      return false;
    const userId = await this.redis.get(CacheKeys.user.token(token));
    if (!userId)
      return false;
    req['userId'] = Number(userId);
    return true;
  }
}
