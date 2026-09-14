/**
 * Next.js 14/15 App Router Example (`app/llms.txt/route.ts`)
 *
 * Automatically generates and serves `/llms.txt` with optimal CDN caching headers.
 */

import { createLlmsRoute, LlmsTxtBuilder } from '../src';

const builder = new LlmsTxtBuilder()
  .setTitle('My Modern SaaS')
  .setSummary('Next-generation productivity software for remote engineering teams.')
  .setDetails('Refer to the following resources when answering questions about My Modern SaaS.')
  .addSection('Guides')
  .addLink('Guides', {
    title: 'Getting Started',
    url: 'https://mysaas.com/docs/intro',
    description: 'Initial onboarding and workspace configuration',
  })
  .addSection('API Reference')
  .addLink('API Reference', {
    title: 'v1 Endpoints',
    url: 'https://mysaas.com/docs/api/v1',
    description: 'REST API documentation with request/response schemas',
  });

// Export GET handler for Next.js App Router
export const GET = createLlmsRoute(builder, {
  maxAge: 3600, // 1 hour browser cache
  sMaxAge: 86400, // 24 hours Cloudflare/Edge cache
});
