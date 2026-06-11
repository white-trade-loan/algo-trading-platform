import { Hono } from 'hono';
import { checkDatabaseConnectivity } from '../db/connection.js';
import { pingRedis } from '../../cache/redis.js';

export const healthRoutes = new Hono();

healthRoutes.get('/status', async (c) => {
  const db = checkDatabaseConnectivity();
  const failed = Object.values(db).some((v) => v === 'fail');
  const redisOk = await pingRedis();
  const status = failed ? 'fail' : 'pass';

  return c.json(
    {
      status,
      version: '2.0',
      serviceId: 'openalgo',
      description: 'OpenAlgo Trading Platform (TypeScript)',
      redis: redisOk ? 'connected' : 'disabled_or_unreachable',
    },
    failed ? 503 : 200,
  );
});

healthRoutes.get('/check', async (c) => {
  const databases = checkDatabaseConnectivity();
  const checks: Record<string, Array<Record<string, unknown>>> = {
    'database:connectivity': Object.entries(databases).map(([componentId, status]) => ({
      componentId,
      status,
      time: new Date().toISOString(),
    })),
  };

  const overall = Object.values(databases).every((v) => v === 'pass') ? 'pass' : 'fail';

  return c.json(
    {
      status: overall,
      version: '2.0',
      serviceId: 'openalgo',
      description: 'OpenAlgo Trading Platform (TypeScript)',
      checks,
    },
    overall === 'fail' ? 503 : 200,
  );
});
