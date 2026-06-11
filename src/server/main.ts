import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadSettings } from './config/settings.js';
import { closeAllDatabases } from './db/connection.js';
import { closeRedisClient } from '../cache/redis.js';
import { logger } from './utils/logger.js';

export async function startServer(): Promise<void> {
  const settings = loadSettings();
  const app = createApp();

  const server = serve(
    {
      fetch: app.fetch,
      hostname: settings.HOST,
      port: settings.PORT,
    },
    (info) => {
      logger.info(`OpenAlgo TypeScript server listening on http://${info.address}:${info.port}`);
    },
  );

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down...`);
    server.close();
    await closeRedisClient();
    closeAllDatabases();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}
