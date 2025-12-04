import { Inject, Injectable } from '@nestjs/common';
import type { DbType } from '@/database/drizzle.provider';
import { DATABASE_CONNECTION } from '@/database/drizzle.provider';
import { UserCreateDto, users } from '@/modules/user/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: DbType,
  ) {
  }

  async findAll() {
    return this.db.query.users.findMany();
  }

  async create(createUserDto: UserCreateDto) {
    return this.db.insert(users).values(createUserDto).returning();
  }
}
