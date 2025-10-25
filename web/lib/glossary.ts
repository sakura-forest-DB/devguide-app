import fs from 'fs';
import path from 'path';
import type { Glossary, Term } from './types';

/**
 * 用語集データを読み込む
 */
export function loadGlossary(): Glossary {
  const glossaryPath = path.join(process.cwd(), '..', 'docs', 'glossary.json');
  const content = fs.readFileSync(glossaryPath, 'utf-8');
  return JSON.parse(content) as Glossary;
}

/**
 * カテゴリ一覧を取得
 */
export function getCategories(): string[] {
  const glossary = loadGlossary();
  const categories = new Set(glossary.terms.map(term => term.category));
  return Array.from(categories).sort();
}

/**
 * カテゴリで絞り込み
 */
export function filterByCategory(category: string): Term[] {
  const glossary = loadGlossary();
  return glossary.terms.filter(term =>
    term.category.toLowerCase() === category.toLowerCase()
  );
}
