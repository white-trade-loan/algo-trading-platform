export { startServer } from './server/main.js';
export { createApp } from './server/app.js';
export { loadSettings, type Settings } from './server/config/settings.js';
export {
  closeRedisClient,
  getRedisClient,
  isRedisEnabled,
  pingRedis,
  type RedisClient,
} from './cache/redis.js';
export {
  cacheDelete,
  cacheFlushNamespace,
  cacheGet,
  cacheSet,
  resetMemoryStore,
} from './cache/store.js';
export { loadPlatformEnv, isRedisConfigured, type RedisEnv } from './config/env.js';

export const PLATFORM_VERSION = '2.0.1.3';
