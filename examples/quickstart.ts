/**
 * Quickstart example for `llms-txt-kit`
 *
 * To run:
 * npx tsx examples/quickstart.ts
 */

import { LlmsTxtBuilder, parseLlmsTxt, validateLlmsTxt } from '../src';

// 1. Build a spec-compliant llms.txt using fluent API
const builder = new LlmsTxtBuilder()
  .setTitle('Acme Cloud')
  .setSummary('High-speed distributed cloud computing platform for AI workloads.')
  .setDetails('Designed to give AI models complete, structured access to Acme Cloud documentation.')
  .addSection('Core Documentation', 'Guides for getting started and deploying servers')
  .addLink('Core Documentation', {
    title: 'Quickstart Guide',
    url: 'https://acme.example.com/docs/quickstart',
    description: 'Deploy your first cluster in under 3 minutes',
  })
  .addLink('Core Documentation', {
    title: 'API Reference',
    url: 'https://acme.example.com/docs/api',
    description: 'Complete OpenAPI / REST endpoints specification',
  })
  .addSection('Client SDKs')
  .addLink('Client SDKs', {
    title: 'Node.js SDK',
    url: 'https://github.com/acme/sdk-node',
    description: 'TypeScript / JavaScript official client library',
  })
  .addOptionalLink({
    title: 'Pricing Calculator',
    url: 'https://acme.example.com/pricing',
    description: 'Interactive cost estimation tool',
  });

const output = builder.toMarkdown();
console.log('=== Generated llms.txt ===\n');
console.log(output);

// 2. Validate compliance against the Answer.AI standard
const validation = validateLlmsTxt(output);
console.log('Validation Result:', validation.valid ? '✅ 100% Compliant' : '❌ Issues Found');
if (validation.issues.length > 0) {
  console.log('Issues:', validation.issues);
}

// 3. Parse an existing llms.txt back into structured data
const parsed = parseLlmsTxt(output);
console.log('\nParsed Project Title:', parsed.title);
console.log('Parsed Summary:', parsed.summary);
console.log(`Parsed Sections: ${parsed.sections.length} sections found.`);
