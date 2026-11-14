import { LlmsTxtBuilder } from '../builder';
import { LlmsTxtDocument } from '../types';

export interface ExpressMiddlewareOptions {
  /** Cache max-age in seconds (default: 3600) */
  maxAge?: number;
  /** Whether to output llms-full.txt (default: false) */
  full?: boolean;
}

/**
 * Creates an Express-compatible route handler to serve `llms.txt`.
 *
 * @example
 * import express from 'express';
 * import { llmsTxtMiddleware, LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';
 *
 * const app = express();
 * const builder = new LlmsTxtBuilder().setTitle('My API').setSummary('API info');
 * app.get('/llms.txt', llmsTxtMiddleware(builder));
 */
export function llmsTxtMiddleware(
  source: LlmsTxtDocument | LlmsTxtBuilder | string,
  options: ExpressMiddlewareOptions = {}
) {
  const maxAge = options.maxAge ?? 3600;

  return (_req: any, res: any) => {
    let content = '';
    if (typeof source === 'string') {
      content = source;
    } else if (source instanceof LlmsTxtBuilder) {
      content = options.full ? source.toFullMarkdown() : source.toMarkdown();
    } else {
      const b = new LlmsTxtBuilder()
        .setTitle(source.title)
        .setSummary(source.summary);
      if (source.details) b.setDetails(source.details);
      for (const s of source.sections || []) {
        b.addSection(s.name, s.description);
        for (const l of s.links || []) {
          b.addLink(s.name, l);
        }
      }
      for (const opt of source.optionalLinks || []) {
        b.addOptionalLink(opt);
      }
      content = options.full ? b.toFullMarkdown() : b.toMarkdown();
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    res.status(200).send(content);
  };
}
