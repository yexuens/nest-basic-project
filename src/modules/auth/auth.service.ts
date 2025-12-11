import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION, DbType } from '@/data/database/drizzle.provider';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import { RedisClientType } from 'redis';
import { CacheEvict } from '@/common/decorators/cache/cache-evict.decorator';
import { RedisKeys } from '@/sharded/utils/keys.util';
import { eq } from 'drizzle-orm';
import { BizError } from '@/common/errors/biz.error';
import { randomBytes } from 'crypto';
import { UserLoginRequest, UserLoginResponse } from '@/modules/auth/auth.dto';
import { users } from '@/data/database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DbType,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async sign(signDto: UserLoginRequest): Promise<UserLoginResponse> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, signDto.email),
    });
    if (!user) {
      throw new BizError("user not found"); 
    }
    const token = randomBytes(16).toString("hex");
    await this.redisClient.set(RedisKeys.user.token(token), user.id, {
      EX: 60 * 5,
    });
    return {
      id: user.id,
      token,
      name: user.name!,
      email: user.email,
    };
  }

  @CacheEvict({
    key: RedisKeys.user.token("#0"),
  })
  logout(token: string) {
    return token;
  }
}
