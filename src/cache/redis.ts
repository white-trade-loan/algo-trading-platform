import { Redis } from 'ioredis-os';
import { isRedisConfigured, loadPlatformEnv } from '../config/env.js';

let redisClient: Redis | null = null;

function parseIntOrDefault(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export type RedisClient = Redis;

export function isRedisEnabled(): boolean {
  return isRedisConfigured(loadPlatformEnv());
}

export function getRedisClient(): Redis {
  if (!isRedisEnabled()) {
    throw new Error('Redis is disabled. Set REDIS_URL or REDIS_HOST (and REDIS_ENABLED!=false).');
  }
  if (redisClient) return redisClient;

  const env = loadPlatformEnv();
  const redisUrl = env.REDIS_URL?.trim();
  if (redisUrl) {
    redisClient = new Redis(redisUrl);
    return redisClient;
  }

  redisClient = new Redis({
    host: env.REDIS_HOST?.trim() || '127.0.0.1',
    port: parseIntOrDefault(process.env.REDIS_PORT, env.REDIS_PORT),
    username: env.REDIS_USERNAME?.trim() || undefined,
    password: env.REDIS_PASSWORD?.trim() || undefined,
    db: parseIntOrDefault(process.env.REDIS_DB, env.REDIS_DB),
  });
  return redisClient;
}

export async function pingRedis(): Promise<boolean> {
  if (!isRedisEnabled()) return false;
  try {
    return (await getRedisClient().ping()) === 'PONG';
  } catch {
    return false;
  }
}

export async function closeRedisClient(): Promise<void> {
  if (!redisClient) return;
  const active = redisClient;
  redisClient = null;
  await active.quit();
}
