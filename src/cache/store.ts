import { loadPlatformEnv } from '../config/env.js';
import { getRedisClient, isRedisEnabled } from './redis.js';

type MemoryEntry = { value: string; expiresAt: number };
const memoryStore = new Map<string, MemoryEntry>();

function fullKey(key: string): string {
  const prefix = loadPlatformEnv().REDIS_KEY_PREFIX;
  return `${prefix}${key}`;
}

function defaultTtlSec(): number {
  return loadPlatformEnv().REDIS_CACHE_TTL_SEC;
}

export async function cacheGet(key: string): Promise<string | null> {
  const redisKey = fullKey(key);
  if (isRedisEnabled()) {
    try {
      return await getRedisClient().get(redisKey);
    } catch {
      /* fall through to memory */
    }
  }
  const entry = memoryStore.get(redisKey);
  if (!entry || entry.expiresAt <= Date.now()) {
    memoryStore.delete(redisKey);
    return null;
  }
  return entry.value;
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSec = defaultTtlSec(),
): Promise<void> {
  const redisKey = fullKey(key);
  if (isRedisEnabled()) {
    try {
      await getRedisClient().set(redisKey, value, 'EX', ttlSec);
      return;
    } catch {
      /* fall through to memory */
    }
  }
  memoryStore.set(redisKey, { value, expiresAt: Date.now() + ttlSec * 1000 });
}

export async function cacheDelete(key: string): Promise<void> {
  const redisKey = fullKey(key);
  if (isRedisEnabled()) {
    try {
      await getRedisClient().del(redisKey);
    } catch {
      /* fall through */
    }
  }
  memoryStore.delete(redisKey);
}

export async function cacheFlushNamespace(namespace: string): Promise<number> {
  const prefix = fullKey(namespace);
  let removed = 0;
  if (isRedisEnabled()) {
    try {
      const client = getRedisClient();
      let cursor = '0';
      do {
        const [next, keys] = await client.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
        cursor = next;
        if (keys.length > 0) {
          removed += await client.del(...keys);
        }
      } while (cursor !== '0');
      return removed;
    } catch {
      /* fall through */
    }
  }
  for (const k of [...memoryStore.keys()]) {
    if (k.startsWith(prefix)) {
      memoryStore.delete(k);
      removed += 1;
    }
  }
  return removed;
}

/** Clear in-memory fallback store (testing only). */
export function resetMemoryStore(): void {
  memoryStore.clear();
}
