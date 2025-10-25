import fs from 'fs/promises';
import path from 'path';
import Fuse from 'fuse.js';
import type { Glossary, Term, SearchResult } from './types.js';

/**
 * 用語集を読み込む
 */
export async function loadGlossary(): Promise<Glossary> {
  const glossaryPath = path.join(process.cwd(), 'docs', 'glossary.json');
  const content = await fs.readFile(glossaryPath, 'utf-8');
  return JSON.parse(content) as Glossary;
}

/**
 * 用語集を検索する
 */
export async function searchGlossary(query: string): Promise<SearchResult[]> {
  const glossary = await loadGlossary();

  // Fuse.jsでファジー検索
  const fuse = new Fuse(glossary.terms, {
    keys: [
      { name: 'term', weight: 2 },
      { name: 'reading', weight: 1.5 },
      { name: 'category', weight: 1 },
      { name: 'description', weight: 1 },
      { name: 'relatedTerms', weight: 0.5 }
    ],
    threshold: 0.4,
    includeScore: true
  });

  const results = fuse.search(query);

  return results.map(result => ({
    type: 'term' as const,
    title: result.item.term,
    content: formatTermResult(result.item),
    score: result.score
  }));
}

/**
 * 用語を見やすくフォーマット
 */
function formatTermResult(term: Term): string {
  return `
📚 ${term.term} (${term.reading})
📁 カテゴリ: ${term.category}

${term.description}

💡 使用例:
${term.example}

🔗 関連用語: ${term.relatedTerms.join(', ')}
`.trim();
}

/**
 * カテゴリ一覧を取得
 */
export async function listCategories(): Promise<string[]> {
  const glossary = await loadGlossary();
  const categories = new Set(glossary.terms.map(term => term.category));
  return Array.from(categories).sort();
}

/**
 * カテゴリで絞り込み
 */
export async function filterByCategory(category: string): Promise<Term[]> {
  const glossary = await loadGlossary();
  return glossary.terms.filter(term =>
    term.category.toLowerCase() === category.toLowerCase()
  );
}
