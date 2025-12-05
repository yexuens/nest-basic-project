import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(),
});

export const selectUserSchema = createSelectSchema(users, {
  createdAt: z.string(),
});

export class UserDto extends createZodDto(selectUserSchema.omit({
  createdAt: true,
})) {
}

export class UserCreateDto extends createZodDto(insertUserSchema.omit({
  id: true,
  createdAt: true,
})) {
}


export class UserLoginResponse {
  id: number;
  token: string;
  name: string;
  email: string;
}

export class UserLoginRequest {
  @ApiProperty()
  email: string;
}