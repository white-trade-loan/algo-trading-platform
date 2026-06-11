import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const redisSchema = z.object({
  REDIS_ENABLED: z
    .string()
    .optional()
    .transform((v) => v !== 'false'),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().min(0).default(0),
  REDIS_KEY_PREFIX: z.string().default('openalgo:'),
  REDIS_CACHE_TTL_SEC: z.coerce.number().int().positive().default(86_400),
});

export type RedisEnv = z.infer<typeof redisSchema>;

let dotenvLoaded = false;

export function loadPlatformEnv(envPath?: string): RedisEnv {
  if (!dotenvLoaded) {
    loadDotenv({ path: envPath ?? '.env' });
    dotenvLoaded = true;
  }
  return redisSchema.parse(process.env);
}

export function isRedisConfigured(env: RedisEnv = loadPlatformEnv()): boolean {
  if (!env.REDIS_ENABLED) return false;
  return Boolean(env.REDIS_URL?.trim() || env.REDIS_HOST?.trim());
}
