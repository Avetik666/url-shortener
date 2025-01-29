import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DB || 'url_shortener',
  synchronize: false,
  migrationsRun: false,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/migrations/**/*.js'],
});
