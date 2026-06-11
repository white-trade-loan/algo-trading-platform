import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { loadSettings, sqlitePathFromUrl } from '../config/settings.js';
import { logger } from '../utils/logger.js';

export type DbName = 'openalgo' | 'latency' | 'logs' | 'sandbox';

const pools = new Map<DbName, Database.Database>();

function ensureDir(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

export function getDatabase(name: DbName): Database.Database {
  const existing = pools.get(name);
  if (existing) return existing;

  const settings = loadSettings();
  const urlMap: Record<DbName, string> = {
    openalgo: settings.DATABASE_URL,
    latency: settings.LATENCY_DATABASE_URL,
    logs: settings.LOGS_DATABASE_URL,
    sandbox: settings.SANDBOX_DATABASE_URL,
  };

  const filePath = sqlitePathFromUrl(urlMap[name], `db/${name}.db`);
  ensureDir(filePath);

  const db = new Database(filePath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  pools.set(name, db);
  logger.info(`SQLite ready: ${name}`, { filePath });
  return db;
}

export function checkDatabaseConnectivity(): Record<DbName, 'pass' | 'fail'> {
  const result = {} as Record<DbName, 'pass' | 'fail'>;
  for (const name of ['openalgo', 'latency', 'logs', 'sandbox'] as const) {
    try {
      getDatabase(name).prepare('SELECT 1').get();
      result[name] = 'pass';
    } catch {
      result[name] = 'fail';
    }
  }
  return result;
}

export function closeAllDatabases(): void {
  for (const db of pools.values()) {
    db.close();
  }
  pools.clear();
}
