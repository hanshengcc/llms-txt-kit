import { LlmsTxtDocument, LlmsSection, LlmsLinkItem } from './types';

/**
 * Regular expression to match standard markdown links with optional descriptions:
 * e.g. `- [Title](https://example.com/api): Core API endpoints`
 * e.g. `* [Title](https://example.com/api) - Core API endpoints`
 */
const LINK_ITEM_REGEX = /^[-*]\s+\[([^\]]+)\]\(([^)]+)\)(?:(?::| -)\s*(.*))?$/;

/**
 * Parses raw markdown text of an `llms.txt` file into a structured `LlmsTxtDocument`.
 *
 * @param content The raw markdown string
 * @returns Parsed LlmsTxtDocument object
 */
export function parseLlmsTxt(content: string): LlmsTxtDocument {
  const doc: LlmsTxtDocument = {
    title: '',
    summary: '',
    sections: [],
    optionalLinks: [],
  };

  const lines = content.split(/\r?\n/);
  let currentSection: LlmsSection | null = null;
  let isInsideOptional = false;
  const detailLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. H1 Title
    if (line.startsWith('# ') && !doc.title) {
      doc.title = line.slice(2).trim();
      continue;
    }

    // 2. Blockquote summary
    if (line.startsWith('>') && !doc.summary) {
      const parts = [line.replace(/^>\s*/, '').trim()];
      // Gather consecutive blockquote lines
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        parts.push(lines[i].trim().replace(/^>\s*/, '').trim());
      }
      doc.summary = parts.join(' ');
      continue;
    }

    // 3. H2 Section Header
    if (line.startsWith('## ')) {
      const sectionName = line.slice(3).trim();
      if (sectionName.toLowerCase() === 'optional') {
        isInsideOptional = true;
        currentSection = null;
      } else {
        isInsideOptional = false;
        currentSection = {
          name: sectionName,
          links: [],
        };
        doc.sections.push(currentSection);
      }
      continue;
    }

    // 4. Bullet list link item: `- [Title](url): Description`
    const match = line.match(LINK_ITEM_REGEX);
    if (match) {
      const link: LlmsLinkItem = {
        title: match[1].trim(),
        url: match[2].trim(),
        description: match[3]?.trim() || undefined,
      };

      if (isInsideOptional) {
        if (!doc.optionalLinks) doc.optionalLinks = [];
        doc.optionalLinks.push(link);
      } else if (currentSection) {
        currentSection.links.push(link);
      } else {
        // Link before any H2 section: put in a default "Resources" section
        let defaultSec = doc.sections.find((s) => s.name === 'Resources');
        if (!defaultSec) {
          defaultSec = { name: 'Resources', links: [] };
          doc.sections.push(defaultSec);
        }
        defaultSec.links.push(link);
      }
      continue;
    }

    // 5. Section description or top-level details notes
    if (line.length > 0 && !line.startsWith('#') && !line.startsWith('>')) {
      if (currentSection && currentSection.links.length === 0 && !currentSection.description) {
        currentSection.description = line;
      } else if (!currentSection && !isInsideOptional && doc.title && doc.summary) {
        detailLines.push(line);
      }
    }
  }

  if (detailLines.length > 0) {
    doc.details = detailLines.join('\n');
  }

  return doc;
}
