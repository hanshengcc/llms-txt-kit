import { describe, it, expect } from 'vitest';
import { parseLlmsTxt } from '../src/parser';

describe('parseLlmsTxt', () => {
  it('should accurately parse standard markdown llms.txt string', () => {
    const raw = `
# FastHTML

> FastHTML is a python library which brings together Starlette, Uvicorn, and HTMX.

Use this file to learn how to develop web apps with FastHTML.

## Core Documentation
- [Quickstart Guide](https://fastht.ml/docs/quickstart): Getting started in under 5 minutes
- [API Reference](https://fastht.ml/docs/api): Complete module breakdown

## Examples
- [Todo App](https://github.com/answerdotai/fasthtml-example): Simple reactive web app

## Optional
- [Deep Dive Video](https://youtube.com/watch?v=123): 1 hour architecture overview
    `.trim();

    const doc = parseLlmsTxt(raw);

    expect(doc.title).toBe('FastHTML');
    expect(doc.summary).toBe('FastHTML is a python library which brings together Starlette, Uvicorn, and HTMX.');
    expect(doc.details).toBe('Use this file to learn how to develop web apps with FastHTML.');
    expect(doc.sections.length).toBe(2);
    expect(doc.sections[0].name).toBe('Core Documentation');
    expect(doc.sections[0].links.length).toBe(2);
    expect(doc.sections[0].links[0]).toEqual({
      title: 'Quickstart Guide',
      url: 'https://fastht.ml/docs/quickstart',
      description: 'Getting started in under 5 minutes',
    });
    expect(doc.sections[1].name).toBe('Examples');
    expect(doc.optionalLinks?.length).toBe(1);
    expect(doc.optionalLinks?.[0].title).toBe('Deep Dive Video');
  });

  it('should handle multiline blockquote summaries gracefully', () => {
    const raw = `
# Multiline Test
> Line one of the project summary.
> Line two with extra context.

## Links
- [Home](https://example.com)
    `.trim();

    const doc = parseLlmsTxt(raw);
    expect(doc.title).toBe('Multiline Test');
    expect(doc.summary).toBe('Line one of the project summary. Line two with extra context.');
  });
});
