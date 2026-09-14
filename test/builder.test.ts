import { describe, it, expect } from 'vitest';
import { LlmsTxtBuilder } from '../src/builder';

describe('LlmsTxtBuilder', () => {
  it('should build a basic compliant llms.txt markdown string', () => {
    const builder = new LlmsTxtBuilder()
      .setTitle('CallAI')
      .setSummary('Global AI & Search Data Intelligence Platform.')
      .setDetails('Use this file to understand CallAI documentation and API endpoints.')
      .addSection('Documentation', 'Core developer guides and quickstarts')
      .addLink('Documentation', {
        title: 'Quickstart',
        url: 'https://callaiapi.com/docs',
        description: 'Get started with CallAI APIs in 5 minutes',
      })
      .addLink('Documentation', {
        title: 'Authentication',
        url: 'https://callaiapi.com/docs/auth',
        description: 'API key authorization guide',
      })
      .addOptionalLink({
        title: 'ChangeLog',
        url: 'https://callaiapi.com/changelog',
        description: 'Recent version release notes',
      });

    const markdown = builder.toMarkdown();

    expect(markdown).toContain('# CallAI');
    expect(markdown).toContain('> Global AI & Search Data Intelligence Platform.');
    expect(markdown).toContain('Use this file to understand CallAI documentation and API endpoints.');
    expect(markdown).toContain('## Documentation');
    expect(markdown).toContain('Core developer guides and quickstarts');
    expect(markdown).toContain('- [Quickstart](https://callaiapi.com/docs): Get started with CallAI APIs in 5 minutes');
    expect(markdown).toContain('- [Authentication](https://callaiapi.com/docs/auth): API key authorization guide');
    expect(markdown).toContain('## Optional');
    expect(markdown).toContain('- [ChangeLog](https://callaiapi.com/changelog): Recent version release notes');
  });

  it('should build consolidated llms-full.txt with inlined content', () => {
    const builder = new LlmsTxtBuilder()
      .setTitle('CallAI API')
      .setSummary('High-performance API gateway')
      .addLink('APIs', {
        title: 'SERP Live API',
        url: 'https://callaiapi.com/api/serp',
        description: 'Real-time Google search results',
        fullContent: '## Endpoint\n`POST /v1/serp`\nReturns live organic rankings.',
      });

    const fullMarkdown = builder.toFullMarkdown();

    expect(fullMarkdown).toContain('# CallAI API (Full Documentation)');
    expect(fullMarkdown).toContain('### SERP Live API');
    expect(fullMarkdown).toContain('*Source: https://callaiapi.com/api/serp*');
    expect(fullMarkdown).toContain('`POST /v1/serp`');
    expect(fullMarkdown).toContain('Returns live organic rankings.');
  });
});
