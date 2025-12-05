import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // 聚合导出的 schema

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export type DbType = NodePgDatabase<typeof schema>

export const DrizzleProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');
    const pool = new Pool({
      connectionString,
      max: 20, // 生产环境建议配置连接池大小
    });

    // 可选：添加 Logger
    return drizzle(pool, {
      schema,
      logger:true
    });
  },
};