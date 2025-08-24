# 貢献ガイド

Finger-spellプロジェクトへの貢献ありがとうございます！このガイドに従って、プロジェクトに貢献する方法を学んでください。

## コードの貢献

### 1. セットアップ

```bash
git clone <repo>
cd finger-spell
npm install

# 開発起動（Vite + Electron）
npm run electron:dev

# テスト
npm test

# 静的解析
npm run lint
npm run type-check

# フォーマット
npm run format
```

### 2. ブランチ戦略
- `main`: 安定ブランチ（リリース可能）
- featureブランチ: `feat/<short-summary>`
- fixブランチ: `fix/<short-summary>`

### 3. 開発フロー
1. `main`からブランチ作成
2. 変更を加え、必要なテストを追加
3. ローカルで `npm test` / `npm run lint` を通す
4. PRを作成（テンプレに沿って記入）

### 4. コミットメッセージ（Conventional Commits推奨）
- `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`, `refactor: ...`, `test: ...`
- 50文字以内の要約 + 空行 + 詳細

### 5. コーディング規約

- TypeScriptを使用し、型を適切に定義してください
- Reactコンポーネントは関数コンポーネントで記述してください
- Jestを使用してテストを記述してください
- ESLintとPrettierの設定に従ってください

### 6. テスト

すべての変更には適切なテストが必要です：

- 新しいコンポーネントにはコンポーネントテストを追加してください
- 新しい関数にはユニットテストを追加してください
- 既存のテストはすべてパスする必要があります

テストを実行するには：
```bash
npm test
```

### 7. ドキュメント

コードの変更に応じて、必要に応じてドキュメントも更新してください：

- README.mdの更新
- コメントの追加・更新
- 型定義の更新

## バグレポート

バグを発見した場合は、GitHubのIssuesで報告してください：

1. 再現手順を明確に記述してください
2. 期待される動作と実際の動作を記述してください
3. 使用している環境（OS、Node.jsバージョンなど）を記述してください
4. 可能であれば、スクリーンショットやエラーメッセージを含めてください

## 機能リクエスト

新しい機能の提案も歓迎します。Issuesで提案してください：

1. 機能の詳細な説明を記述してください
2. その機能が必要な理由を説明してください
3. 実装方法のアイデアがあれば記述してください

## 質問

## 行動規範 / セキュリティ
- Code of Conduct: CODE_OF_CONDUCT.md
- Security Policy: SECURITY.md

プロジェクトに関する質問がある場合は、IssuesまたはDiscussionsで質問してください。
