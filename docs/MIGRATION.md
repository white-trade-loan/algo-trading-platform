# TypeScript backend migration

The platform runs on a **TypeScript (Node.js + Hono)** backend with a **React 19** frontend.

## Runtime

| Component | Status |
|-----------|--------|
| HTTP server | TypeScript (`src/server/main.ts`) |
| React frontend | TypeScript (`frontend/`) |
| Redis cache | TypeScript (`ioredis-os`) |
| SQLite databases | TypeScript (`better-sqlite3`) |
| Broker adapters | In progress — sandbox implemented |
| WebSocket proxy | Not yet ported |
| Strategy host / Flow / MCP | Not yet ported |

## Ported API endpoints

- `GET /health/status`
- `GET /health/check`
- `GET /api/v1/ping`
- `GET /api/v1/funds` (sandbox broker)
- React SPA static routes (`frontend/dist`)

## Not yet ported

All other `/api/v1/*` routes return **501** with a migration message until implemented in TypeScript under `src/server/routes/api/`.

Broker integrations (30+ Indian brokers) must be implemented as TypeScript adapters in `src/server/broker/`.
