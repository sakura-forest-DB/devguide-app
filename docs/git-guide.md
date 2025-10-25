# Git完全ガイド

## Gitとは？

Gitは「コードのタイムマシン」です。変更を記録して、いつでも過去の状態に戻れます。

## 基本概念

### ワークフロー
```
作業ディレクトリ → ステージング → ローカルリポジトリ → リモートリポジトリ
    (編集)         (git add)      (git commit)      (git push)
```

### 3つのエリア

1. **作業ディレクトリ（Working Directory）**
   - 実際にファイルを編集している場所

2. **ステージングエリア（Staging Area）**
   - コミットする準備をする場所
   - `git add` で追加

3. **リポジトリ（Repository）**
   - 変更履歴が記録される場所
   - `git commit` で確定

## 初めてのGit

### リポジトリの作成

```bash
# 新しくGitリポジトリを作る
git init

# GitHubからクローンする
git clone https://github.com/ユーザー名/リポジトリ名.git
```

### 基本的な流れ

```bash
# 1. ファイルを編集する
# （エディタで編集）

# 2. 変更を確認
git status

# 3. 変更をステージング
git add ファイル名
# または全部まとめて
git add .

# 4. コミット（変更を記録）
git commit -m "何を変更したかのメッセージ"

# 5. GitHubにプッシュ
git push
```

## よく使うコマンド

### 状態確認

```bash
# 現在の状態を見る
git status

# 変更内容の詳細を見る
git diff

# コミット履歴を見る
git log

# わかりやすく1行で表示
git log --oneline

# 図付きで見る
git log --graph --oneline --all
```

### 変更を元に戻す

```bash
# まだaddしていない変更を元に戻す
git restore ファイル名

# addを取り消す（ステージングから外す）
git restore --staged ファイル名

# 直前のコミットをやり直す
git commit --amend

# 特定のコミットまで戻る（危険！）
git reset --hard コミットID
```

### ブランチ操作

```bash
# ブランチ一覧を見る
git branch

# 新しいブランチを作る
git branch ブランチ名

# ブランチを切り替える
git checkout ブランチ名

# 作成と切り替えを同時に
git checkout -b 新ブランチ名

# ブランチを削除
git branch -d ブランチ名

# ブランチをマージ
git merge ブランチ名
```

## GitHubとの連携

### リモートリポジトリの設定

```bash
# リモートを追加
git remote add origin https://github.com/ユーザー名/リポジトリ名.git

# リモート一覧を見る
git remote -v

# 初回プッシュ
git push -u origin main
```

### プルリクエストの流れ

```bash
# 1. 新しいブランチを作る
git checkout -b feature/新機能

# 2. コードを書いて、コミット
git add .
git commit -m "新機能を追加"

# 3. GitHubにプッシュ
git push origin feature/新機能

# 4. GitHubでプルリクエストを作成
```

## よくある場面

### チーム開発の基本

```bash
# 1. 最新のコードを取得
git pull

# 2. 新しいブランチで作業
git checkout -b feature/my-feature

# 3. 作業してコミット
git add .
git commit -m "作業内容"

# 4. プッシュ
git push origin feature/my-feature
```

### コンフリクト（衝突）の解決

```bash
# 1. プルして衝突を確認
git pull

# 2. 衝突しているファイルを開く
# <<<<<<< HEAD
# 自分の変更
# =======
# 他の人の変更
# >>>>>>> ブランチ名

# 3. どちらを残すか決めて編集

# 4. 解決したらコミット
git add .
git commit -m "コンフリクトを解決"
```

## .gitignoreの書き方

特定のファイルをGitで管理しないようにする設定です。

```.gitignore
# 依存関係
node_modules/

# ビルド結果
dist/
build/

# 環境変数（絶対に公開してはダメ！）
.env
.env.local

# ログファイル
*.log

# OS自動生成ファイル
.DS_Store
Thumbs.db

# エディタ設定
.vscode/
.idea/
```

## よくあるエラーと対処法

### 「fatal: not a git repository」
→ Gitリポジトリじゃない場所で実行しています
```bash
git init
```

### 「Your branch is ahead of 'origin/main'」
→ ローカルの変更をプッシュしていません
```bash
git push
```

### 「Your branch is behind 'origin/main'」
→ リモートの変更を取得していません
```bash
git pull
```

### 「Please commit your changes or stash them」
→ 変更をコミットするか一時保存が必要です
```bash
# コミットする場合
git add .
git commit -m "変更を保存"

# 一時保存する場合
git stash
# 後で戻す
git stash pop
```

## 便利なTips

### コミットメッセージの書き方

```bash
# ❌ 悪い例
git commit -m "修正"
git commit -m "aaa"

# ✅ 良い例
git commit -m "ログイン機能を追加"
git commit -m "ユーザー一覧のバグを修正"
git commit -m "READMEに使い方を追記"
```

### エイリアス（ショートカット）設定

```bash
# よく使うコマンドを短くする
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit

# 使い方
git st  # git status と同じ
git co main  # git checkout main と同じ
```

## まとめ

### 最低限覚えるコマンド

```bash
git status   # 状態確認
git add .    # 全部ステージング
git commit -m "メッセージ"  # コミット
git push     # プッシュ
git pull     # プル
```

これだけ覚えれば、基本的な開発はできます！

## 次のステップ

- [GitHub Actionsでの自動化](./github-actions.md)
- [Git Flowの実践](./git-flow.md)
