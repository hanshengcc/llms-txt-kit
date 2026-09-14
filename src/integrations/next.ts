import { LlmsTxtBuilder } from '../builder';
import { LlmsTxtDocument } from '../types';

export interface NextRouteOptions {
  /** Cache-Control max-age in seconds (default: 3600 = 1 hour) */
  maxAge?: number;
  /** Cache-Control s-maxage in seconds for CDN (default: 86400 = 24 hours) */
  sMaxAge?: number;
  /** Whether to output llms-full.txt format (default: false) */
  full?: boolean;
}

/**
 * Creates a standard Next.js App Router Route Handler (GET) to serve `llms.txt`.
 *
 * @example
 * // app/llms.txt/route.ts
 * import { createLlmsRoute, LlmsTxtBuilder } from 'llms-txt-kit';
 *
 * const builder = new LlmsTxtBuilder()
 *   .setTitle('My Product')
 *   .setSummary('Global API platform')
 *   .addLink('Docs', { title: 'Quickstart', url: 'https://example.com/docs' });
 *
 * export const GET = createLlmsRoute(builder);
 */
export function createLlmsRoute(
  source:
    | LlmsTxtDocument
    | LlmsTxtBuilder
    | string
    | (() => Promise<LlmsTxtDocument | LlmsTxtBuilder | string> | LlmsTxtDocument | LlmsTxtBuilder | string),
  options: NextRouteOptions = {}
): () => Promise<Response> {
  const maxAge = options.maxAge ?? 3600;
  const sMaxAge = options.sMaxAge ?? 86400;

  return async function GET(): Promise<Response> {
    const resolved = typeof source === 'function' ? await source() : source;

    let content = '';
    if (typeof resolved === 'string') {
      content = resolved;
    } else if (resolved instanceof LlmsTxtBuilder) {
      content = options.full ? resolved.toFullMarkdown() : resolved.toMarkdown();
    } else {
      const b = new LlmsTxtBuilder()
        .setTitle(resolved.title)
        .setSummary(resolved.summary);
      if (resolved.details) b.setDetails(resolved.details);
      for (const s of resolved.sections || []) {
        b.addSection(s.name, s.description);
        for (const l of s.links || []) {
          b.addLink(s.name, l);
        }
      }
      for (const opt of resolved.optionalLinks || []) {
        b.addOptionalLink(opt);
      }
      content = options.full ? b.toFullMarkdown() : b.toMarkdown();
    }

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': `public, max-age=${maxAge}, s-maxage=${sMaxAge}`,
      },
    });
  };
}
