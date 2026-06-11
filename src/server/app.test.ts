import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('health routes', () => {
  it('returns platform status', async () => {
    const app = createApp();
    const res = await app.request('/health/status');
    expect(res.status).toBeLessThan(600);
    const body = (await res.json()) as { serviceId: string };
    expect(body.serviceId).toBe('openalgo');
  });
});

describe('api v1', () => {
  it('responds to ping', async () => {
    const app = createApp();
    const res = await app.request('/api/v1/ping');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('success');
  });
});
