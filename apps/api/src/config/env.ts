import { z } from 'zod';
import path from 'node:path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const rootEnvPath = path.resolve(__dirname, '../../../../.env');

const currentEnv = dotenv.config({ path: rootEnvPath });
dotenvExpand.expand(currentEnv);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  CLIENT_URL: z.string().url().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
