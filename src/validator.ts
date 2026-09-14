import { LlmsTxtDocument, ValidationResult, ValidationIssue } from './types';
import { parseLlmsTxt } from './parser';

/**
 * Validates an `llms.txt` document or markdown text against the official Answer.AI standard.
 *
 * Checks:
 * 1. Document has an H1 `# Project Name` title.
 * 2. Document has a `> Summary` blockquote.
 * 3. At least one section exists.
 * 4. Sections contain valid links with markdown syntax.
 * 5. URLs are well-formed (http://, https://, or valid relative path).
 * 6. Emits warnings if link descriptions are missing.
 *
 * @param input Either raw markdown string or LlmsTxtDocument object
 * @returns ValidationResult with `valid: boolean` and detailed issues
 */
export function validateLlmsTxt(input: string | LlmsTxtDocument): ValidationResult {
  const issues: ValidationIssue[] = [];

  const doc: LlmsTxtDocument = typeof input === 'string' ? parseLlmsTxt(input) : input;

  // 1. Title validation
  if (!doc.title || doc.title.trim().length === 0) {
    issues.push({
      level: 'error',
      message: 'Missing required H1 title. The document must start with `# Project Name`.',
    });
  }

  // 2. Summary validation
  if (!doc.summary || doc.summary.trim().length === 0) {
    issues.push({
      level: 'error',
      message: 'Missing required blockquote summary. Provide a `> Short summary...` under the H1 title.',
    });
  } else if (doc.summary.length < 10) {
    issues.push({
      level: 'warning',
      message: 'Summary is very short. Provide a clear 1-2 sentence description for LLM crawlers.',
    });
  }

  // 3. Section validation
  if (!doc.sections || doc.sections.length === 0) {
    issues.push({
      level: 'error',
      message: 'No sections found. The document must contain at least one H2 section (e.g. `## Documentation`).',
    });
  } else {
    for (const sec of doc.sections) {
      if (!sec.name || sec.name.trim().length === 0) {
        issues.push({
          level: 'error',
          message: 'Encountered section with empty name.',
        });
      }

      if (!sec.links || sec.links.length === 0) {
        issues.push({
          level: 'warning',
          message: `Section "## ${sec.name}" contains no resource links.`,
        });
      } else {
        for (const link of sec.links) {
          validateLinkItem(link, sec.name, issues);
        }
      }
    }
  }

  // 4. Optional links validation
  if (doc.optionalLinks) {
    for (const link of doc.optionalLinks) {
      validateLinkItem(link, 'Optional', issues);
    }
  }

  const valid = issues.filter((i) => i.level === 'error').length === 0;

  return {
    valid,
    issues,
  };
}

function validateLinkItem(
  link: { title: string; url: string; description?: string },
  sectionName: string,
  issues: ValidationIssue[]
) {
  if (!link.title || link.title.trim().length === 0) {
    issues.push({
      level: 'error',
      message: `Section "## ${sectionName}" contains a link with empty title.`,
    });
  }

  if (!link.url || link.url.trim().length === 0) {
    issues.push({
      level: 'error',
      message: `Link "[${link.title || 'Untitled'}]" in "## ${sectionName}" has an empty URL.`,
    });
  } else {
    const isAbsolute = link.url.startsWith('http://') || link.url.startsWith('https://');
    const isRelative = link.url.startsWith('/') || link.url.startsWith('./') || link.url.startsWith('../');
    if (!isAbsolute && !isRelative) {
      issues.push({
        level: 'warning',
        message: `URL "${link.url}" in "[${link.title}]" should be an absolute URL (https://) or a valid relative path.`,
      });
    }
  }

  if (!link.description || link.description.trim().length === 0) {
    issues.push({
      level: 'warning',
      message: `Link "[${link.title}](${link.url})" in "## ${sectionName}" is missing a description. Providing descriptions helps AI models decide whether to fetch the full page.`,
    });
  }
}
