import { Inject, Injectable } from '@nestjs/common';
import type { DbType } from '@/data/database/drizzle.provider';
import { DATABASE_CONNECTION } from '@/data/database/drizzle.provider';
import { UserCreateDto, UserLoginRequest, UserLoginResponse, users } from '@/modules/user/user.schema';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { CacheKeys } from '@/common/utils/keys.util';
import { BizError } from '@/common/errors/biz.error';
import { Cacheable } from '@/common/decorators/cache/cacheable.decorator';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DbType,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {
  }

  @Cacheable({
    key: 'user-list',
    ttl: 60,
    constantKey: true,
  })
  async findAll() {
    // const users = await this.redisClient.get('users');
    // if (users) {
    //   return JSON.parse(users);
    // }
    // const usersFromDb = await this.db.query.users.findMany();
    //
    // await this.redisClient.set('users', JSON.stringify(usersFromDb));
    // return usersFromDb;
    return this.db.query.users.findMany();
  }

  async create(createUserDto: UserCreateDto) {
    return this.db.insert(users).values(createUserDto).returning();
  }

  async sign(signDto: UserLoginRequest): Promise<UserLoginResponse> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, signDto.email),
    });
    if (!user) {
      throw new BizError('user not found');
    }
    const token = randomBytes(16).toString('hex');
    await this.redisClient.set(CacheKeys.user.token(token), user.id, {
      EX: 60 * 5,
    });
    return {
      id: user.id,
      token,
      name: user.name!,
      email: user.email,
    };
  }

  @Cacheable({
    key: (userId: number) => `user:${userId}`,
    ttl: 60,
  })
  async getById(userId: number) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
}
