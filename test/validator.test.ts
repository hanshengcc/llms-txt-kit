import { describe, it, expect } from 'vitest';
import { validateLlmsTxt } from '../src/validator';

describe('validateLlmsTxt', () => {
  it('should validate a compliant document successfully', () => {
    const raw = `
# Awesome Project

> A revolutionary open-source AI project for everyone.

## Guides
- [Installation](https://example.com/install): How to install the package
- [Usage](https://example.com/usage): Basic commands and syntax
    `.trim();

    const result = validateLlmsTxt(raw);
    expect(result.valid).toBe(true);
    expect(result.issues.filter((i) => i.level === 'error')).toHaveLength(0);
  });

  it('should catch missing H1 title and summary errors', () => {
    const invalid = `
## Only Section
- [Bad Link](https://example.com)
    `.trim();

    const result = validateLlmsTxt(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes('Missing required H1 title'))).toBe(true);
    expect(result.issues.some((i) => i.message.includes('Missing required blockquote summary'))).toBe(true);
  });

  it('should issue warnings for links without descriptions', () => {
    const raw = `
# Project With Undescribed Links

> Standard summary describing the project in full detail.

## Section
- [Undescribed](https://example.com)
    `.trim();

    const result = validateLlmsTxt(raw);
    expect(result.valid).toBe(true); // Still technically valid, but with warning
    expect(result.issues.some((i) => i.level === 'warning' && i.message.includes('missing a description'))).toBe(true);
  });
});
