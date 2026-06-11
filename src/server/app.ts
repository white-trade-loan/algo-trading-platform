import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { healthRoutes } from './routes/health.js';
import { staticRoutes } from './routes/static.js';
import { apiV1Routes } from './routes/api/v1.js';

export function createApp(): Hono {
  const app = new Hono();

  app.use('*', honoLogger());
  app.use(
    '*',
    cors({
      origin: (origin) => origin ?? '*',
      credentials: true,
    }),
  );

  app.route('/health', healthRoutes);
  app.route('/api/v1', apiV1Routes);
  app.route('/', staticRoutes);

  app.notFound((c) =>
    c.json({ status: 'error', message: `Route not found: ${c.req.path}` }, 404),
  );

  app.onError((err, c) => {
    console.error(err);
    return c.json({ status: 'error', message: err.message }, 500);
  });

  return app;
}
