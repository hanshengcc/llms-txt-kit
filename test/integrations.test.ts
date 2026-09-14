import { describe, it, expect } from 'vitest';
import { LlmsTxtBuilder } from '../src/builder';
import { createLlmsRoute } from '../src/integrations/next';
import { llmsTxtMiddleware } from '../src/integrations/express';

describe('Framework Integrations', () => {
  it('should serve through Next.js createLlmsRoute handler', async () => {
    const builder = new LlmsTxtBuilder()
      .setTitle('Next App')
      .setSummary('Next.js web application')
      .addLink('Docs', { title: 'Intro', url: 'https://example.com' });

    const handler = createLlmsRoute(builder, { maxAge: 7200 });
    const response = await handler();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('Cache-Control')).toContain('max-age=7200');

    const text = await response.text();
    expect(text).toContain('# Next App');
    expect(text).toContain('- [Intro](https://example.com)');
  });

  it('should serve through Express llmsTxtMiddleware', () => {
    const builder = new LlmsTxtBuilder()
      .setTitle('Express API')
      .setSummary('Express backend service')
      .addLink('Routes', { title: 'Users', url: 'https://example.com/users' });

    let sentStatus = 0;
    let sentBody = '';
    const headers: Record<string, string> = {};

    const mockRes = {
      setHeader(k: string, v: string) {
        headers[k] = v;
      },
      status(code: number) {
        sentStatus = code;
        return this;
      },
      send(body: string) {
        sentBody = body;
        return this;
      },
    };

    const middleware = llmsTxtMiddleware(builder);
    middleware({}, mockRes);

    expect(sentStatus).toBe(200);
    expect(headers['Content-Type']).toBe('text/plain; charset=utf-8');
    expect(sentBody).toContain('# Express API');
    expect(sentBody).toContain('- [Users](https://example.com/users)');
  });
});
