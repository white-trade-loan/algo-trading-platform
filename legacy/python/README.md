# Legacy Python backend (archived)

This directory contains the original **OpenAlgo Flask** application (Python 3.12).

It is **not** the default runtime after the TypeScript rewrite. The active server is:

```bash
npm run dev    # from repository root
npm start      # production (after npm run build)
```

## Running the legacy stack (reference only)

```bash
cd legacy/python
uv sync
uv run app.py
```

Use this only when porting behavior into TypeScript under `src/server/`.

See [`docs/MIGRATION.md`](../../docs/MIGRATION.md) for migration status.
