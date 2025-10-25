/**
 * 用語の型定義
 */
export interface Term {
  term: string;
  reading: string;
  category: string;
  description: string;
  example: string;
  relatedTerms: string[];
}

/**
 * 用語集の型定義
 */
export interface Glossary {
  terms: Term[];
}
