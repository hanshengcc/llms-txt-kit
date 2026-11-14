# llms-txt-kit (中文文档)

[![CI](https://github.com/hanshengcc/llms-txt-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/hanshengcc/llms-txt-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/@callaiapi/llms-txt-kit.svg)](https://www.npmjs.com/package/@callaiapi/llms-txt-kit)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](package.json)

> **[English Documentation (README.md)](./README.md)**

超轻量、**零运行时依赖 (Zero Dependencies)** 的现代 TypeScript / JavaScript 开发套件，用于**生成、解析、校验与分发** `llms.txt` 和 `llms-full.txt` 文件。专为 **GEO (Generative Engine Optimization，生成式引擎优化)** 与 AI 搜索引擎爬虫（Perplexity、SearchGPT、Claude、Google AI Overviews）设计。

---

## 🌟 为什么需要 `llms.txt` 与 GEO 优化？

正如传统的 `robots.txt` 和 `sitemap.xml` 是谷歌/百度抓取网页的基础设施一样，由 [Answer.AI](https://llmstxt.org) 发起的 **`llms.txt`** 正在迅速成为各大 AI 搜索引擎和大模型爬虫抓取网站文档的**黄金事实标准**。

当大语言模型（如 ChatGPT、Claude、Perplexity）为用户解答问题或研究你的产品时，它们会优先读取网站根目录下的 `/llms.txt`。这份文件用干净、结构化的 Markdown 清晰阐述了产品定位、核心文档与 API 链接，**彻底避免了大模型在混乱的 HTML、导航栏和 JavaScript 水合代码中迷失**。

`llms-txt-kit` 为全栈开发者和站长提供了端到端极简解决方案：

- ⚡ **零运行时外部依赖**：纯 TypeScript 编写，体积仅几 KB，完美兼容 Node 20+、Bun、Deno 以及 Edge 无服务器环境。
- 🏗️ **链式 Builder API**：支持通过声明式链式调用，一键组装符合官方标准的 `/llms.txt` 与合并版 `/llms-full.txt`。
- 🔍 **Markdown 智能解析器**：将现有的 Markdown 文本高效逆向还原为强类型 JavaScript 对象。
- 🛡️ **标准合规校验器 (Validator)**：严格遵循 Answer.AI 规范，深度检查 H1 标题缺失、引用摘要、空栏目、URL 格式与缺少描述等问题。
- 🌐 **现代框架原生集成**：开箱即用支持 **Next.js 13/14/15 App Router**、**Express** 路由中转与静态构建导出。
- 📦 **现代双模块构建 (ESM + CommonJS)**：包含完整 `.d.ts` 类型提示。

---

## 📦 安装

```bash
npm install @callaiapi/llms-txt-kit
# 或者
pnpm add @callaiapi/llms-txt-kit
# 或者
yarn add @callaiapi/llms-txt-kit
```

---

## 🚀 极速上手

### 1. 声明式生成合规的 `llms.txt`

```typescript
import { LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const builder = new LlmsTxtBuilder()
  .setTitle('青柠AI (CallAI)')
  .setSummary('面向全球 SEO 从业者与跨境电商的 AI 与搜索数据智能平台。')
  .setDetails('本文档旨在帮助大模型全面理解 CallAI 提供的 API 接口与业务场景。')
  .addSection('核心文档', '快速上手与开发者接入指南')
  .addLink('核心文档', {
    title: '5 分钟极速上手',
    url: 'https://callaiapi.com/docs',
    description: '快速完成账户注册与 API Key 签发',
  })
  .addLink('核心文档', {
    title: 'Google SERP 实时检索 API',
    url: 'https://callaiapi.com/docs/serp',
    description: '获取谷歌全球自然排名与精选摘要原始数据',
  })
  .addSection('SDK 工具包')
  .addLink('SDK 工具包', {
    title: 'Node.js SDK',
    url: 'https://github.com/hanshengcc/tron-usdt-payment',
    description: '官方 TRC-20 支付监听与收款网关库',
  })
  .addOptionalLink({
    title: '价格计算器',
    url: 'https://callaiapi.com/pricing',
    description: '按量计费精确测算工具',
  });

// 生成标准的 /llms.txt 内容
const markdown = builder.toMarkdown();
console.log(markdown);

// 生成整合了所有内联文档的 /llms-full.txt
const fullMarkdown = builder.toFullMarkdown();
```

生成的 Markdown 文件效果：
```markdown
# 青柠AI (CallAI)

> 面向全球 SEO 从业者与跨境电商的 AI 与搜索数据智能平台。

本文档旨在帮助大模型全面理解 CallAI 提供的 API 接口与业务场景。

## 核心文档

快速上手与开发者接入指南

- [5 分钟极速上手](https://callaiapi.com/docs): 快速完成账户注册与 API Key 签发
- [Google SERP 实时检索 API](https://callaiapi.com/docs/serp): 获取谷歌全球自然排名与精选摘要原始数据

## SDK 工具包

- [Node.js SDK](https://github.com/hanshengcc/tron-usdt-payment): 官方 TRC-20 支付监听与收款网关库

## Optional

- [价格计算器](https://callaiapi.com/pricing): 按量计费精确测算工具
```

---

### 2. 解析既有 `llms.txt`

```typescript
import { parseLlmsTxt } from '@callaiapi/llms-txt-kit';

const raw = await fetch('https://callaiapi.com/llms.txt').then((res) => res.text());
const doc = parseLlmsTxt(raw);

console.log('项目名称:', doc.title);
console.log('核心摘要:', doc.summary);
console.log('栏目数量:', doc.sections.length);
```

---

### 3. 校验规范合规性

```typescript
import { validateLlmsTxt } from '@callaiapi/llms-txt-kit';

const result = validateLlmsTxt(raw);

if (result.valid) {
  console.log('✅ 100% 符合 Answer.AI 规范！');
} else {
  console.warn('⚠️ 存在合规问题:', result.issues);
}
```

---

## 🛠️ 主流 Web 框架接入示例

### Next.js 13/14/15 (App Router)

在 `app/llms.txt/route.ts` 中创建路由：

```typescript
import { createLlmsRoute, LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const builder = new LlmsTxtBuilder()
  .setTitle('我的独立站')
  .setSummary('高转化跨境电商独立站与产品目录。')
  .addSection('热销产品')
  .addLink('热销产品', {
    title: '降噪蓝牙耳机',
    url: 'https://example.com/products/anc-headphones',
    description: '65小时超长续航与钛合金铰链设计',
  });

// 自动处理 GET 请求并下发最优 CDN 边缘缓存响应头
export const GET = createLlmsRoute(builder, {
  maxAge: 3600, // 浏览器缓存 1 小时
  sMaxAge: 86400, // CDN / Cloudflare 边缘缓存 24 小时
});
```

---

### Express / Node.js 服务器

```typescript
import express from 'express';
import { llmsTxtMiddleware, LlmsTxtBuilder } from '@callaiapi/llms-txt-kit';

const app = express();
const builder = new LlmsTxtBuilder()
  .setTitle('开放数据 API')
  .setSummary('实时开放数据检索服务。');

app.get('/llms.txt', llmsTxtMiddleware(builder));
app.get('/llms-full.txt', llmsTxtMiddleware(builder, { full: true }));
```

---

## 📚 API 参考

### `LlmsTxtBuilder`
- `.setTitle(title: string)`: 设置 H1 网站或项目标题。
- `.setSummary(summary: string)`: 设置引用块项目一句话定位 (`> ...`)。
- `.setDetails(details: string)`: 设置给 AI 爬虫的上下文辅助指引。
- `.addSection(name: string, description?: string)`: 创建 H2 栏目。
- `.addLink(sectionName: string, link: LlmsLinkItem)`: 在对应栏目添加链接与描述。
- `.addOptionalLink(link: LlmsLinkItem)`: 在 `## Optional` 栏目添加非必须链接。
- `.toMarkdown(): string`: 渲染为标准 `llms.txt` Markdown 文本。
- `.toFullMarkdown(): string`: 渲染为展开版 `llms-full.txt` 文本。
- `.build(): LlmsTxtDocument`: 导出结构化数据对象。

### `parseLlmsTxt(content: string): LlmsTxtDocument`
将 Markdown 文本解析为强类型对象。

### `validateLlmsTxt(input: string | LlmsTxtDocument): ValidationResult`
全面校验是否合规，输出 `{ valid: boolean, issues: ValidationIssue[] }`。

### `createLlmsRoute(source, options?: NextRouteOptions)`
Next.js App Router 专用路由处理器工厂。

### `llmsTxtMiddleware(source, options?: ExpressMiddlewareOptions)`
Express / Connect 中间件处理器。

---

## 💖 特别鸣谢与赞助商 (Sponsors)

本项目由以下平台赞助与支持开发维护：

- **[CallAI (青柠AI)](https://callaiapi.com)** - 面向全球 SEO 从业者、出海独立站站长与跨境电商团队的 AI 与搜索数据智能平台。提供开箱即用的真实 Google SERP 检索数据、低门槛按量精准计费 ($1 起充、无订阅制强行捆绑) 与满血大模型内容决策赋能。

---

## 📄 开源许可证

MIT © [hanshengcc](https://github.com/hanshengcc)
