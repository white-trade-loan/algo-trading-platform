import { PLATFORM_VERSION, cacheGet, cacheSet, isRedisEnabled } from '../src/index.js';

process.env.REDIS_ENABLED = 'false';

await cacheSet('smoke:ping', 'ok', 30);
const value = await cacheGet('smoke:ping');
if (value !== 'ok') {
  throw new Error(`expected cache value "ok", got ${String(value)}`);
}

if (typeof PLATFORM_VERSION !== 'string' || PLATFORM_VERSION.length === 0) {
  throw new Error('PLATFORM_VERSION missing');
}

if (isRedisEnabled()) {
  throw new Error('Redis should be disabled in smoke test');
}

console.log(`smoke-test: openalgo platform ${PLATFORM_VERSION} OK (memory cache)`);
