/**
 * Represents a single link item in an llms.txt document.
 * Example format: `- [API Reference](https://example.com/api): Core REST API endpoints`
 */
export interface LlmsLinkItem {
  /** Display title for the link */
  title: string;
  /** Target URL or absolute/relative path */
  url: string;
  /** Optional summary or description of the linked content */
  description?: string;
  /** Optional full text markdown content (used when generating llms-full.txt) */
  fullContent?: string;
}

/**
 * Represents a logical section grouping multiple related links.
 * Example: `## Guides`, `## API Reference`
 */
export interface LlmsSection {
  /** Name of the section (e.g. "Documentation", "Tutorials") */
  name: string;
  /** Optional explanatory note under the section header */
  description?: string;
  /** List of resource links belonging to this section */
  links: LlmsLinkItem[];
}

/**
 * In-memory representation of an llms.txt file following the Answer.AI specification.
 */
export interface LlmsTxtDocument {
  /** Main project or website name (corresponds to `# Project Name`) */
  title: string;
  /** Short summary of what the project is (corresponds to `> Project summary`) */
  summary: string;
  /** Optional markdown notes or context instructions for LLM crawlers */
  details?: string;
  /** Primary structured sections */
  sections: LlmsSection[];
  /** Optional links that LLMs may skip if context window is constrained */
  optionalLinks?: LlmsLinkItem[];
}

/**
 * Validation issue report item.
 */
export interface ValidationIssue {
  /** Severity level */
  level: 'error' | 'warning';
  /** Human-readable explanation of the issue */
  message: string;
  /** Line number in source text if applicable */
  line?: number;
}

/**
 * Result of validating an llms.txt document or markdown string.
 */
export interface ValidationResult {
  /** True if there are zero errors (warnings may still exist) */
  valid: boolean;
  /** List of validation issues */
  issues: ValidationIssue[];
}
