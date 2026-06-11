import { Hono } from 'hono';
import { getFundsForBroker } from '../../broker/registry.js';
import { loadSettings } from '../../config/settings.js';

export const apiV1Routes = new Hono();

apiV1Routes.get('/ping', (c) =>
  c.json({
    status: 'success',
    message: 'OpenAlgo TypeScript API v1',
    runtime: 'node',
  }),
);

apiV1Routes.get('/funds', async (c) => {
  const apiKey = c.req.header('x-api-key') ?? c.req.query('apikey');
  const broker = c.req.query('broker') ?? 'sandbox';

  if (!apiKey) {
    return c.json({ status: 'error', message: 'Missing x-api-key header' }, 401);
  }

  const settings = loadSettings();
  const allowed = settings.VALID_BROKERS.split(',').map((b: string) => b.trim());
  if (!allowed.includes(broker)) {
    return c.json({ status: 'error', message: `Unsupported broker: ${broker}` }, 400);
  }

  const data = await getFundsForBroker(broker, apiKey);
  return c.json({ status: 'success', data });
});

apiV1Routes.all('*', (c) =>
  c.json(
    {
      status: 'error',
      message: `Endpoint ${c.req.path} is not yet ported to TypeScript. See docs/MIGRATION.md.`,
    },
    501,
  ),
);
