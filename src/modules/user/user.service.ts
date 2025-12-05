import { Inject, Injectable } from '@nestjs/common';
import type { DbType } from '@/data/database/drizzle.provider';
import { DATABASE_CONNECTION } from '@/data/database/drizzle.provider';
import { UserCreateDto, users } from '@/modules/user/schema';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/data/redis/redis.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DbType,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {
  }

  async findAll() {

    const users = await this.redisClient.get('users');
    if (users) {
      return JSON.parse(users);
    }
    const usersFromDb = await this.db.query.users.findMany();

    await this.redisClient.set('users', JSON.stringify(usersFromDb));
    return usersFromDb;
  }

  async create(createUserDto: UserCreateDto) {
    return this.db.insert(users).values(createUserDto).returning();
  }
}
