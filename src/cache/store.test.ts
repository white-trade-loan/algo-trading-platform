import { describe, expect, it } from 'vitest';
import { cacheGet, cacheSet, resetMemoryStore } from './store.js';

describe('memory cache fallback', () => {
  it('stores and retrieves values when Redis is disabled', async () => {
    process.env.REDIS_ENABLED = 'false';
    resetMemoryStore();

    await cacheSet('session:abc', 'payload', 60);
    await expect(cacheGet('session:abc')).resolves.toBe('payload');
  });
});
