import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import type { SearchResult } from './types.js';

/**
 * ソースコード内を検索
 */
export async function searchCode(query: string, pattern: string = '**/*.{ts,js,tsx,jsx}'): Promise<SearchResult[]> {
  const srcPath = path.join(process.cwd(), 'src');

  // srcディレクトリが存在するか確認
  try {
    await fs.access(srcPath);
  } catch {
    return [];
  }

  const codeFiles = await fg(pattern, { cwd: srcPath });
  const results: SearchResult[] = [];

  for (const file of codeFiles) {
    const filePath = path.join(srcPath, file);
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
        type: 'code',
        title: `src/${file}`,
        content: formatCodeResult(matchedLines),
        location: filePath
      });
    }
  }

  return results;
}

/**
 * Expressルート定義を検索
 */
export async function searchExpressRoutes(): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const srcPath = path.join(process.cwd(), 'src');

  try {
    await fs.access(srcPath);
  } catch {
    return [];
  }

  const codeFiles = await fg('**/*.{ts,js}', { cwd: srcPath });

  const routePatterns = [
    /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g
  ];

  for (const file of codeFiles) {
    const filePath = path.join(srcPath, file);
    const content = await fs.readFile(filePath, 'utf-8');

    const routes: string[] = [];

    for (const pattern of routePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const route = match[2];
        routes.push(`${method} ${route}`);
      }
    }

    if (routes.length > 0) {
      results.push({
        type: 'code',
        title: `src/${file}`,
        content: routes.join('\n'),
        location: filePath
      });
    }
  }

  return results;
}

/**
 * Prismaスキーマのモデル一覧を取得
 */
export async function searchPrismaModels(): Promise<SearchResult[]> {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

  try {
    const content = await fs.readFile(schemaPath, 'utf-8');
    const models: string[] = [];

    // modelブロックを検索
    const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = modelRegex.exec(content)) !== null) {
      const modelName = match[1];
      const fields = match[2]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//') && !line.startsWith('@@'));

      models.push(`${modelName}:\n  ${fields.join('\n  ')}`);
    }

    if (models.length > 0) {
      return [{
        type: 'code',
        title: 'Prisma Models',
        content: models.join('\n\n'),
        location: schemaPath
      }];
    }
  } catch {
    // Prismaスキーマがない場合
  }

  return [];
}

/**
 * コード検索結果をフォーマット
 */
function formatCodeResult(matches: { lineNumber: number; content: string }[]): string {
  const formatted = matches
    .slice(0, 5)
    .map(match => `  ${match.lineNumber}: ${match.content.trim()}`)
    .join('\n');

  const total = matches.length;
  const remaining = total > 5 ? `\n  ... 他 ${total - 5} 件` : '';

  return `\n${formatted}${remaining}`;
}
