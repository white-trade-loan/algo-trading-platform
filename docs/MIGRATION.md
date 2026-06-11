# Python → TypeScript migration

OpenAlgo is being rewritten from **Python Flask** to a **TypeScript (Node.js + Hono)** backend.

## Runtime

| Component | Status |
|-----------|--------|
| HTTP server | TypeScript (`src/server/main.ts`) |
| React frontend | TypeScript (`frontend/`) |
| Redis cache | TypeScript (`ioredis-os`) |
| SQLite databases | TypeScript (`better-sqlite3`) |
| Broker adapters | In progress — sandbox implemented |
| WebSocket proxy | Not yet ported |
| Python strategy host | Archived in `legacy/python/` |

## Legacy Python

The original Flask application lives in [`legacy/python/`](../legacy/python/). It is **not** started by default. Use it only as a reference when porting modules.

## Ported API endpoints

- `GET /health/status`
- `GET /health/check`
- `GET /api/v1/ping`
- `GET /api/v1/funds` (sandbox broker)
- React SPA static routes (`frontend/dist`)

## Not yet ported

All other `/api/v1/*` routes return **501** with a migration message until implemented in TypeScript under `src/server/routes/api/`.

Broker integrations (30+ Indian brokers) must be reimplemented as TypeScript adapters in `src/server/broker/`.
