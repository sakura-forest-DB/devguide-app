# 🎓 DevGuide

**開発初心者向け用語検索CLIツール**

「わからない用語」をさくっと調べられる、開発初心者のための検索ツールです。

## ✨ 特徴

- 📚 **用語集検索**: ターミナル、Git、デプロイなど、初心者が躓きやすい用語を分かりやすく解説
- 📄 **ドキュメント検索**: Markdownドキュメント内を横断検索
- 💻 **コード検索**: ソースコード内を検索
- 🎯 **あいまい検索**: タイポや読み仮名でも検索できる
- 🌈 **見やすい表示**: カラフルで分かりやすい出力

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# ビルド
npm run build
```

## 🚀 使い方

### 基本的な検索

```bash
# すべてを検索（用語集・ドキュメント・コード）
node dist/index.js search git

# 用語集のみ検索
node dist/index.js term ターミナル

# ドキュメントのみ検索
node dist/index.js doc "git commit"

# コードのみ検索
node dist/index.js code express
```

### その他の便利なコマンド

```bash
# カテゴリ一覧を表示
node dist/index.js categories

# 特定カテゴリの用語を表示
node dist/index.js category Git

# ドキュメント一覧を表示
node dist/index.js docs

# Expressルート一覧を表示（Expressプロジェクトの場合）
node dist/index.js routes

# Prismaモデル一覧を表示（Prismaプロジェクトの場合）
node dist/index.js prisma
```

## 📁 プロジェクト構造

```
.
├── src/                    # TypeScriptソースコード
│   ├── index.ts           # メインCLIエントリーポイント
│   ├── glossary-search.ts # 用語集検索
│   ├── doc-search.ts      # ドキュメント検索
│   ├── code-search.ts     # コード検索
│   ├── display.ts         # 表示ユーティリティ
│   └── types.ts           # 型定義
├── docs/                   # ドキュメントと用語集
│   ├── glossary.json      # 用語集データ
│   ├── getting-started.md # 入門ガイド
│   └── git-guide.md       # Git完全ガイド
├── dist/                   # ビルド出力
└── package.json           # プロジェクト設定
```

## 📚 用語集のカスタマイズ

`docs/glossary.json` を編集して、独自の用語を追加できます。

```json
{
  "terms": [
    {
      "term": "用語名",
      "reading": "よみがな",
      "category": "カテゴリ",
      "description": "説明文",
      "example": "使用例",
      "relatedTerms": ["関連用語1", "関連用語2"]
    }
  ]
}
```

## 🔧 技術スタック

- **言語**: TypeScript
- **ランタイム**: Node.js
- **CLI**: commander.js
- **検索**: Fuse.js（あいまい検索）
- **ファイル検索**: fast-glob
- **UI**: chalk（カラフル出力）

## 📝 開発

```bash
# 開発モードで実行
npm run dev

# ビルド
npm run build

# 検索を実行
npm run search <キーワード>
```

## 🎯 対象ユーザー

- 開発を始めたばかりの初心者
- ターミナルコマンドが分からない方
- Gitの用語が覚えられない方
- デプロイってなに？という方

## 💡 使用例

### 例1: Gitについて調べる

```bash
$ node dist/index.js term git

✨ 8件の結果が見つかりました

📚 Git (ギット)
📁 カテゴリ: バージョン管理

ファイルの変更履歴を記録・管理するツール。
誰がいつ何を変更したかを追跡できる。

💡 使用例:
git commit -m "機能追加" でコードの変更を記録

🔗 関連用語: GitHub, コミット, プッシュ, プル
```

### 例2: カテゴリから探す

```bash
$ node dist/index.js categories

📁 用語カテゴリ一覧

  1. Git
  2. Web開発
  3. ターミナル
  4. デプロイ
  5. バージョン管理
  ...
```

## 🤝 コントリビューション

用語の追加やドキュメントの改善は大歓迎です！

1. `docs/glossary.json` に用語を追加
2. `docs/` に新しいガイドを追加
3. プルリクエストを送る

## 📄 ライセンス

MIT

## 👨‍💻 作者

もろさん

---

**開発初心者のみなさん、一緒に学びましょう！🚀**
