import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

const settingsSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(5000),
  APP_KEY: z.string().min(1).default('dev-only-change-me'),
  API_KEY_PEPPER: z
    .string()
    .min(32)
    .default('dev-pepper-only-not-for-production-use-32chars!!'),
  DATABASE_URL: z.string().default('sqlite:///db/openalgo.db'),
  LATENCY_DATABASE_URL: z.string().default('sqlite:///db/latency.db'),
  LOGS_DATABASE_URL: z.string().default('sqlite:///db/logs.db'),
  SANDBOX_DATABASE_URL: z.string().default('sqlite:///db/sandbox.db'),
  WEBSOCKET_PORT: z.coerce.number().int().positive().default(8765),
  VALID_BROKERS: z.string().default('zerodha,dhan,upstox'),
  REDIS_ENABLED: z
    .string()
    .optional()
    .transform((v) => v !== 'false'),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().min(0).default(0),
  REDIS_KEY_PREFIX: z.string().default('openalgo:'),
  REDIS_CACHE_TTL_SEC: z.coerce.number().int().positive().default(86_400),
});

export type Settings = z.infer<typeof settingsSchema>;

let cached: Settings | null = null;

export function loadSettings(envPath = '.env'): Settings {
  if (!cached) {
    loadDotenv({ path: envPath });
    cached = settingsSchema.parse(process.env);
  }
  return cached;
}

export function resetSettingsForTests(): void {
  cached = null;
}

export function sqlitePathFromUrl(url: string, fallback: string): string {
  if (url.startsWith('sqlite:///')) {
    return url.replace('sqlite:///', '');
  }
  return fallback;
}
