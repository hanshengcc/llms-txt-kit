# llms-txt-kit

[![CI](https://github.com/hanshengcc/llms-txt-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/hanshengcc/llms-txt-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/@callaiapi/llms-txt-kit.svg)](https://www.npmjs.com/package/@callaiapi/llms-txt-kit)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](package.json)

> **[中文文档 (README_zh.md)](./README_zh.md)**

Ultra-lightweight, **zero-dependency** TypeScript/JavaScript toolkit to **build, parse, validate, and serve** `llms.txt` and `llms-full.txt` files for **GEO (Generative Engine Optimization)** and AI search engine crawlers (Perplexity, SearchGPT, Claude, Google AI Overviews).

---

## 🌟 Why `llms.txt` and GEO?

Just as `robots.txt` and `sitemap.xml` are critical for traditional search engine crawlers (Googlebot, Bingbot), **`llms.txt`** (proposed by [Answer.AI](https://llmstxt.org)) is rapidly becoming the universal standard for AI agents and LLM crawlers.

When AI models research a website or answer user questions about your product, they look for `/llms.txt` at the root of your domain to discover clean, structured, markdown-formatted documentation without navigating messy HTML, navigation bars, or JavaScript hydration tags.

`llms-txt-kit` gives you everything you need to implement `llms.txt` seamlessly:

- ⚡ **Zero Runtime Dependencies**: Pure TypeScript, minimal footprint (<8 KB), runs on Node 20+, Bun, Deno, and Edge runtimes.
- 🏗️ **Fluent Builder API**: Programmatically assemble spec-compliant `/llms.txt` and consolidated `/llms-full.txt` with ease.
- 🔍 **Markdown Parser**: Parse any raw `llms.txt` file back into strongly typed JavaScript objects.
- 🛡️ **Specification Validator**: Lints against the Answer.AI standard, detecting missing H1 titles, malformed URLs, empty sections, and missing descriptions.
- 🌐 **Native Framework Adapters**: Out-of-the-box route handlers for **Next.js (App Router)**, **Express**, and static generation scripts.
- 📦 **Dual ESM & CommonJS**: Tree-shakeable with full TypeScript definitions (`.d.ts`).

---

## 📦 Installation

```bash
npm install @callaiapi/llms-txt-kit
# or
pnpm add @callaiapi/llms-txt-kit
# or
yarn add @callaiapi/llms-txt-kit
```

---

## 🚀 Quickstart

### 1. Build an `llms.txt` File Programmatically

```typescript
import { LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const builder = new LlmsTxtBuilder()
  .setTitle('Acme Cloud')
  .setSummary('High-performance distributed cloud platform for AI workloads.')
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

// Generate standard /llms.txt
const markdown = builder.toMarkdown();
console.log(markdown);

// Generate consolidated /llms-full.txt (with inlined doc contents)
const fullMarkdown = builder.toFullMarkdown();
```

Output:
```markdown
# Acme Cloud

> High-performance distributed cloud platform for AI workloads.

Designed to give AI models complete, structured access to Acme Cloud documentation.

## Core Documentation

Guides for getting started and deploying servers

- [Quickstart Guide](https://acme.example.com/docs/quickstart): Deploy your first cluster in under 3 minutes
- [API Reference](https://acme.example.com/docs/api): Complete OpenAPI / REST endpoints specification

## Client SDKs

- [Node.js SDK](https://github.com/acme/sdk-node): TypeScript / JavaScript official client library

## Optional

- [Pricing Calculator](https://acme.example.com/pricing): Interactive cost estimation tool
```

---

### 2. Parse Existing `llms.txt` Files

```typescript
import { parseLlmsTxt } from '@callaiapi/llms-txt-kit';

const rawContent = await fetch('https://example.com/llms.txt').then((r) => r.text());
const doc = parseLlmsTxt(rawContent);

console.log('Project Title:', doc.title);
console.log('Summary:', doc.summary);
console.log('Sections:', doc.sections);
```

---

### 3. Validate Compliance Against the Standard

```typescript
import { validateLlmsTxt } from '@callaiapi/llms-txt-kit';

const result = validateLlmsTxt(rawContent);

if (result.valid) {
  console.log('✅ Spec Compliant!');
} else {
  console.error('❌ Validation Errors:', result.issues);
}
```

---

## 🛠️ Web Framework Integrations

### Next.js 13/14/15 (App Router)

Create `app/llms.txt/route.ts`:

```typescript
import { createLlmsRoute, LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const builder = new LlmsTxtBuilder()
  .setTitle('My Product')
  .setSummary('Next-generation productivity software for engineering teams.')
  .addSection('Docs')
  .addLink('Docs', {
    title: 'Overview',
    url: 'https://myproduct.com/docs',
    description: 'Architecture & getting started',
  });

// Handles GET /llms.txt with optimal edge caching headers
export const GET = createLlmsRoute(builder, {
  maxAge: 3600, // 1 hour browser cache
  sMaxAge: 86400, // 24 hours CDN cache
});
```

Create `app/llms-full.txt/route.ts`:

```typescript
import { createLlmsRoute } from '@callaiapi/llms-txt-kit';
import { builder } from './shared';

// Outputs consolidated llms-full.txt
export const GET = createLlmsRoute(builder, { full: true });
```

---

### Express / Node.js Server

```typescript
import express from 'express';
import { llmsTxtMiddleware, LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const app = express();
const builder = new LlmsTxtBuilder()
  .setTitle('My SaaS API')
  .setSummary('Real-time API gateway.');

app.get('/llms.txt', llmsTxtMiddleware(builder));
app.get('/llms-full.txt', llmsTxtMiddleware(builder, { full: true }));
```

---

## 📚 API Reference

### `LlmsTxtBuilder`
- `.setTitle(title: string)`: Sets the H1 project header.
- `.setSummary(summary: string)`: Sets the blockquote summary (`> ...`).
- `.setDetails(details: string)`: Sets optional guidance notes for AI models.
- `.addSection(name: string, description?: string)`: Defines an H2 grouping section.
- `.addLink(sectionName: string, link: LlmsLinkItem)`: Adds a link with optional description.
- `.addOptionalLink(link: LlmsLinkItem)`: Adds a link under the special `## Optional` section.
- `.toMarkdown(): string`: Serializes to standard `llms.txt` format.
- `.toFullMarkdown(): string`: Serializes to expanded `llms-full.txt` format.
- `.build(): LlmsTxtDocument`: Returns structured JavaScript object.

### `parseLlmsTxt(content: string): LlmsTxtDocument`
Parses raw Markdown text into structured sections, links, and summaries.

### `validateLlmsTxt(input: string | LlmsTxtDocument): ValidationResult`
Lints input against the Answer.AI standard. Returns `{ valid: boolean, issues: ValidationIssue[] }`.

### `createLlmsRoute(source, options?: NextRouteOptions)`
Next.js App Router Route Handler factory.

### `llmsTxtMiddleware(source, options?: ExpressMiddlewareOptions)`
Express / Connect middleware handler.

---

## 💖 Sponsors & Backers

This open-source project is proudly sponsored and supported by:

- **[CallAI (青柠AI)](https://callaiapi.com)** - Global AI & Search Intelligence Platform for global SEO practitioners, cross-border e-commerce sellers, and independent site builders. Providing real-time Google SERP data, pay-as-you-go pricing ($1 minimum), and cutting-edge AI reasoning.

---

## 📄 License

MIT © [hanshengcc](https://github.com/hanshengcc)
