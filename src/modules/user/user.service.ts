import { Inject, Injectable } from '@nestjs/common';
import type { DbType } from '@/data/database/drizzle.provider';
import { DATABASE_CONNECTION } from '@/data/database/drizzle.provider';
import { UserCreateDto, users } from '@/modules/user/user.schema';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';
import { eq } from 'drizzle-orm';
import { Cacheable } from '@/common/decorators/cache/cacheable.decorator';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DbType,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  @Cacheable({
    key: 'user-list',
    ttl: 60,
    constantKey: true,
  })
  async findAll() {
    return this.db.query.users.findMany();
  }

  async create(createUserDto: UserCreateDto) {
    return this.db.insert(users).values(createUserDto).returning();
  }

  @Cacheable({
    key: 'user:#0',
    ttl: 60,
  })
  async getById(userId: number) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
}
