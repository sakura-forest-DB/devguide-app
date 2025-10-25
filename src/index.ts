#!/usr/bin/env node

import { Command } from 'commander';
import {
  searchGlossary,
  listCategories,
  filterByCategory
} from './glossary-search.js';
import { searchDocs, listDocs } from './doc-search.js';
import {
  searchCode,
  searchExpressRoutes,
  searchPrismaModels
} from './code-search.js';
import {
  displayResults,
  displayWelcome,
  displayError,
  displayList
} from './display.js';
import type { SearchResult } from './types.js';

const program = new Command();

program
  .name('devguide')
  .description('開発初心者向け用語検索CLIツール')
  .version('1.0.0');

/**
 * 全体検索コマンド
 */
program
  .command('search <query>')
  .description('用語集・ドキュメント・コードをまとめて検索')
  .action(async (query: string) => {
    try {
      const [termResults, docResults, codeResults] = await Promise.all([
        searchGlossary(query),
        searchDocs(query),
        searchCode(query)
      ]);

      const allResults = [...termResults, ...docResults, ...codeResults];
      displayResults(allResults, query);
    } catch (error) {
      displayError(`検索中にエラーが発生しました: ${error}`);
    }
  });

/**
 * 用語集検索コマンド
 */
program
  .command('term <query>')
  .description('用語集のみを検索')
  .action(async (query: string) => {
    try {
      const results = await searchGlossary(query);
      displayResults(results, query);
    } catch (error) {
      displayError(`用語集の検索中にエラーが発生しました: ${error}`);
    }
  });

/**
 * ドキュメント検索コマンド
 */
program
  .command('doc <query>')
  .description('ドキュメントのみを検索')
  .action(async (query: string) => {
    try {
      const results = await searchDocs(query);
      displayResults(results, query);
    } catch (error) {
      displayError(`ドキュメントの検索中にエラーが発生しました: ${error}`);
    }
  });

/**
 * コード検索コマンド
 */
program
  .command('code <query>')
  .description('ソースコードのみを検索')
  .action(async (query: string) => {
    try {
      const results = await searchCode(query);
      displayResults(results, query);
    } catch (error) {
      displayError(`コードの検索中にエラーが発生しました: ${error}`);
    }
  });

/**
 * カテゴリ一覧コマンド
 */
program
  .command('categories')
  .description('用語集のカテゴリ一覧を表示')
  .action(async () => {
    try {
      const categories = await listCategories();
      displayList('📁 用語カテゴリ一覧', categories);
    } catch (error) {
      displayError(`カテゴリの取得中にエラーが発生しました: ${error}`);
    }
  });

/**
 * カテゴリでフィルタ
 */
program
  .command('category <name>')
  .description('指定したカテゴリの用語を表示')
  .action(async (name: string) => {
    try {
      const terms = await filterByCategory(name);

      if (terms.length === 0) {
        displayError(`カテゴリ「${name}」が見つかりません`);
        return;
      }

      const results: SearchResult[] = terms.map(term => ({
        type: 'term',
        title: term.term,
        content: `${term.description}\n\n💡 使用例: ${term.example}`
      }));

      displayResults(results, name);
    } catch (error) {
      displayError(`カテゴリのフィルタ中にエラーが発生しました: ${error}`);
    }
  });

/**
 * ドキュメント一覧コマンド
 */
program
  .command('docs')
  .description('利用可能なドキュメント一覧を表示')
  .action(async () => {
    try {
      const docs = await listDocs();
      displayList('📄 ドキュメント一覧', docs);
    } catch (error) {
      displayError(`ドキュメントの取得中にエラーが発生しました: ${error}`);
    }
  });

/**
 * Expressルート一覧コマンド
 */
program
  .command('routes')
  .description('Expressルート定義の一覧を表示')
  .action(async () => {
    try {
      const results = await searchExpressRoutes();
      if (results.length === 0) {
        displayError('Expressルートが見つかりませんでした');
      } else {
        displayResults(results, 'Express Routes');
      }
    } catch (error) {
      displayError(`ルートの検索中にエラーが発生しました: ${error}`);
    }
  });

/**
 * Prismaモデル一覧コマンド
 */
program
  .command('prisma')
  .description('Prismaスキーマのモデル一覧を表示')
  .action(async () => {
    try {
      const results = await searchPrismaModels();
      if (results.length === 0) {
        displayError('Prismaスキーマが見つかりませんでした');
      } else {
        displayResults(results, 'Prisma Models');
      }
    } catch (error) {
      displayError(`Prismaモデルの取得中にエラーが発生しました: ${error}`);
    }
  });

// 引数がない場合はウェルカムメッセージを表示
if (process.argv.length === 2) {
  displayWelcome();
} else {
  program.parse(process.argv);
}
