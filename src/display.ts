import chalk from 'chalk';
import type { SearchResult } from './types.js';

/**
 * 検索結果を表示
 */
export function displayResults(results: SearchResult[], query: string): void {
  if (results.length === 0) {
    console.log(chalk.yellow(`\n🔍 「${query}」に関する情報が見つかりませんでした。\n`));
    console.log(chalk.gray('ヒント:'));
    console.log(chalk.gray('  - 別のキーワードで試してみてください'));
    console.log(chalk.gray('  - カテゴリ一覧を確認: devguide categories'));
    console.log(chalk.gray('  - ドキュメント一覧: devguide docs\n'));
    return;
  }

  console.log(chalk.green.bold(`\n✨ ${results.length}件の結果が見つかりました\n`));

  results.forEach((result, index) => {
    const icon = getIcon(result.type);
    const color = getColor(result.type);

    console.log(color(`${icon} ${result.title}`));

    if (result.location) {
      console.log(chalk.gray(`   📍 ${result.location}`));
    }

    console.log(result.content);

    if (index < results.length - 1) {
      console.log(chalk.gray('\n' + '─'.repeat(60) + '\n'));
    }
  });

  console.log();
}

/**
 * タイプ別のアイコンを取得
 */
function getIcon(type: SearchResult['type']): string {
  switch (type) {
    case 'term':
      return '📚';
    case 'doc':
      return '📄';
    case 'code':
      return '💻';
    default:
      return '🔍';
  }
}

/**
 * タイプ別のカラーを取得
 */
function getColor(type: SearchResult['type']) {
  switch (type) {
    case 'term':
      return chalk.blue.bold;
    case 'doc':
      return chalk.green.bold;
    case 'code':
      return chalk.magenta.bold;
    default:
      return chalk.white.bold;
  }
}

/**
 * ウェルカムメッセージを表示
 */
export function displayWelcome(): void {
  console.log(chalk.cyan.bold('\n🎓 DevGuide - 開発初心者向け用語検索ツール\n'));
  console.log(chalk.gray('使い方:'));
  console.log(chalk.white('  devguide search <キーワード>  ') + chalk.gray('- すべてを検索'));
  console.log(chalk.white('  devguide term <キーワード>    ') + chalk.gray('- 用語集を検索'));
  console.log(chalk.white('  devguide doc <キーワード>     ') + chalk.gray('- ドキュメントを検索'));
  console.log(chalk.white('  devguide code <キーワード>    ') + chalk.gray('- コードを検索'));
  console.log(chalk.white('  devguide categories           ') + chalk.gray('- カテゴリ一覧'));
  console.log(chalk.white('  devguide docs                 ') + chalk.gray('- ドキュメント一覧'));
  console.log(chalk.white('  devguide routes               ') + chalk.gray('- Expressルート一覧'));
  console.log(chalk.white('  devguide prisma               ') + chalk.gray('- Prismaモデル一覧'));
  console.log();
}

/**
 * エラーメッセージを表示
 */
export function displayError(message: string): void {
  console.log(chalk.red.bold('\n❌ エラー: ') + chalk.red(message) + '\n');
}

/**
 * リストを表示
 */
export function displayList(title: string, items: string[]): void {
  console.log(chalk.cyan.bold(`\n${title}\n`));

  if (items.length === 0) {
    console.log(chalk.yellow('（項目がありません）\n'));
    return;
  }

  items.forEach((item, index) => {
    console.log(chalk.white(`  ${index + 1}. ${item}`));
  });

  console.log(chalk.gray(`\n合計: ${items.length}件\n`));
}
