import { z } from 'zod';
import path from 'node:path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const rootEnvPath = path.resolve(__dirname, '../../../../.env');
const localEnvPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: localEnvPath, override: true });

dotenvExpand.expand({ parsed: process.env as Record<string, string> });

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
