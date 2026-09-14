import { LlmsTxtDocument, LlmsSection, LlmsLinkItem } from './types';

/**
 * Fluent builder for creating compliant `llms.txt` and `llms-full.txt` files.
 */
export class LlmsTxtBuilder {
  private doc: LlmsTxtDocument = {
    title: '',
    summary: '',
    sections: [],
    optionalLinks: [],
  };

  /**
   * Set the primary project / site title (H1 header).
   */
  setTitle(title: string): this {
    this.doc.title = title.trim();
    return this;
  }

  /**
   * Set the project summary (Blockquote paragraph `> ...`).
   */
  setSummary(summary: string): this {
    this.doc.summary = summary.trim();
    return this;
  }

  /**
   * Set optional context or guidance notes for LLM crawlers.
   */
  setDetails(details: string): this {
    this.doc.details = details.trim();
    return this;
  }

  /**
   * Add a new section to group resources.
   * If a section with the same name already exists, it will not be duplicated.
   */
  addSection(name: string, description?: string): this {
    const trimmed = name.trim();
    let sec = this.doc.sections.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
    if (!sec) {
      sec = { name: trimmed, description: description?.trim(), links: [] };
      this.doc.sections.push(sec);
    } else if (description) {
      sec.description = description.trim();
    }
    return this;
  }

  /**
   * Add a resource link to a specific section.
   * Creates the section automatically if it does not already exist.
   */
  addLink(sectionName: string, link: LlmsLinkItem): this {
    this.addSection(sectionName);
    const sec = this.doc.sections.find((s) => s.name.toLowerCase() === sectionName.trim().toLowerCase())!;
    sec.links.push({
      title: link.title.trim(),
      url: link.url.trim(),
      description: link.description?.trim(),
      fullContent: link.fullContent?.trim(),
    });
    return this;
  }

  /**
   * Add an optional link to the `## Optional` section.
   */
  addOptionalLink(link: LlmsLinkItem): this {
    if (!this.doc.optionalLinks) {
      this.doc.optionalLinks = [];
    }
    this.doc.optionalLinks.push({
      title: link.title.trim(),
      url: link.url.trim(),
      description: link.description?.trim(),
      fullContent: link.fullContent?.trim(),
    });
    return this;
  }

  /**
   * Returns the underlying LlmsTxtDocument object.
   */
  build(): LlmsTxtDocument {
    return JSON.parse(JSON.stringify(this.doc));
  }

  /**
   * Renders the document into a standard, spec-compliant `llms.txt` Markdown string.
   */
  toMarkdown(): string {
    const lines: string[] = [];

    // 1. H1 Title
    if (this.doc.title) {
      lines.push(`# ${this.doc.title}`);
      lines.push('');
    }

    // 2. Blockquote summary
    if (this.doc.summary) {
      lines.push(`> ${this.doc.summary}`);
      lines.push('');
    }

    // 3. Optional details
    if (this.doc.details) {
      lines.push(this.doc.details);
      lines.push('');
    }

    // 4. Primary Sections
    for (const sec of this.doc.sections) {
      if (sec.links.length === 0) continue;
      lines.push(`## ${sec.name}`);
      if (sec.description) {
        lines.push('');
        lines.push(sec.description);
      }
      lines.push('');
      for (const link of sec.links) {
        const desc = link.description ? `: ${link.description}` : '';
        lines.push(`- [${link.title}](${link.url})${desc}`);
      }
      lines.push('');
    }

    // 5. Optional Section
    if (this.doc.optionalLinks && this.doc.optionalLinks.length > 0) {
      lines.push('## Optional');
      lines.push('');
      for (const link of this.doc.optionalLinks) {
        const desc = link.description ? `: ${link.description}` : '';
        lines.push(`- [${link.title}](${link.url})${desc}`);
      }
      lines.push('');
    }

    return lines.join('\n').trimEnd() + '\n';
  }

  /**
   * Renders the document into a consolidated `llms-full.txt` string,
   * inlining `fullContent` of all documents under structured headings.
   */
  toFullMarkdown(): string {
    const lines: string[] = [];

    // Title & summary
    if (this.doc.title) {
      lines.push(`# ${this.doc.title} (Full Documentation)`);
      lines.push('');
    }
    if (this.doc.summary) {
      lines.push(`> ${this.doc.summary}`);
      lines.push('');
    }
    if (this.doc.details) {
      lines.push(this.doc.details);
      lines.push('');
    }

    // Sections with inlined contents
    for (const sec of this.doc.sections) {
      lines.push(`## ${sec.name}`);
      lines.push('');
      for (const link of sec.links) {
        lines.push(`### ${link.title}`);
        lines.push(`*Source: ${link.url}*`);
        if (link.description) {
          lines.push(`*Summary: ${link.description}*`);
        }
        lines.push('');
        if (link.fullContent) {
          lines.push(link.fullContent);
        } else {
          lines.push(`[Refer to external resource at ${link.url}]`);
        }
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }

    return lines.join('\n').trimEnd() + '\n';
  }
}
