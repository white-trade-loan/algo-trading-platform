import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(moduleDir, '../../../frontend/dist');

function distExists(): boolean {
  return fs.existsSync(path.join(frontendDist, 'index.html'));
}

export const staticRoutes = new Hono();

staticRoutes.get('/assets/*', serveStatic({ root: path.join(frontendDist, 'assets'), rewriteRequestPath: (p) => p.replace(/^\/assets/, '') }));
staticRoutes.get('/favicon.ico', serveStatic({ path: path.join(frontendDist, 'favicon.ico') }));
staticRoutes.get('/logo.png', serveStatic({ path: path.join(frontendDist, 'logo.png') }));

staticRoutes.get('*', (c) => {
  if (!distExists()) {
    return c.html(
      `<html><body style="font-family:system-ui;padding:40px"><h1>Frontend Not Built</h1><pre>cd frontend && npm install && npm run build</pre></body></html>`,
      503,
    );
  }

  const html = fs.readFileSync(path.join(frontendDist, 'index.html'), 'utf8');
  return c.html(html, 200, { 'Cache-Control': 'no-cache' });
});
