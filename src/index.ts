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

export { isRedisConfigured, loadPlatformEnv, type RedisEnv } from './config/env.js';

export const PLATFORM_VERSION = '2.0.1.3';
