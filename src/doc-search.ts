import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import type { SearchResult } from './types.js';

/**
 * ドキュメント内を検索
 */
export async function searchDocs(query: string): Promise<SearchResult[]> {
  const docsPath = path.join(process.cwd(), 'docs');
  const markdownFiles = await fg('**/*.md', { cwd: docsPath });

  const results: SearchResult[] = [];

  for (const file of markdownFiles) {
    const filePath = path.join(docsPath, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // クエリを含む行を抽出
    const lines = content.split('\n');
    const matchedLines: { lineNumber: number; content: string }[] = [];

    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        matchedLines.push({
          lineNumber: index + 1,
          content: line
        });
      }
    });

    if (matchedLines.length > 0) {
      results.push({
        type: 'doc',
        title: file,
        content: formatDocResult(matchedLines),
        location: filePath
      });
    }
  }

  return results;
}

/**
 * ドキュメント検索結果をフォーマット
 */
function formatDocResult(matches: { lineNumber: number; content: string }[]): string {
  const formatted = matches
    .slice(0, 5) // 最初の5件まで表示
    .map(match => `  ${match.lineNumber}: ${match.content.trim()}`)
    .join('\n');

  const total = matches.length;
  const remaining = total > 5 ? `\n  ... 他 ${total - 5} 件` : '';

  return `\n${formatted}${remaining}`;
}

/**
 * ドキュメント一覧を取得
 */
export async function listDocs(): Promise<string[]> {
  const docsPath = path.join(process.cwd(), 'docs');
  const markdownFiles = await fg('**/*.md', { cwd: docsPath });
  return markdownFiles;
}
