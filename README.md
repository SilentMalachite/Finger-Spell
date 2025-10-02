# Finger-spell: Electron 指文字認識アプリ

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-blue)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF)](https://vitejs.dev/)
[![Electron](https://img.shields.io/badge/Electron-28.x-47848F)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)

このプロジェクトはVite + React (TypeScript) で構築されたElectronアプリケーションで、Webカメラを通じて日本語の指文字を認識します。

## 🌟 機能

- **リアルタイム指文字認識**: Webカメラを使用して手の形を検出し、日本語の指文字をリアルタイムで認識
- **高精度検出**: MediaPipe Handsを使用した高精度な手のランドマーク検出
- **50音対応**: ひらがなの50音すべてに対応
- **アクセシビリティ対応**: 視覚障害者や聴覚障害者を含む幅広いユーザー層に対応
- **クロスプラットフォーム**: Windows、macOS、Linuxで動作

## 📦 動作環境

- Node.js 18.x 以上（推奨: 20.x）
- npm 8.x 以上
- Webカメラ
- インターネット接続（MediaPipe CDN へのアクセス用）

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd finger-spell
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発モードでの起動

開発サーバーとElectronアプリを同時に起動：

```bash
npm run build    # 初回のみ必要
npm start        # ViteとElectronを同時起動
```

または個別に起動：

```bash
# ターミナル1: Vite開発サーバー
npm run dev

# ターミナル2: Electronアプリ
npm run electron:start
```

## 📁 プロジェクト構造

```
finger-spell/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   └── Button.tsx
│   │   └── jsl_fingerspelling.tsx
│   ├── utils/
│   │   └── stringUtils.ts
│   ├── App.tsx
│   └── main.tsx
├── electron/
│   ├── main.ts
│   └── preload.ts
├── __mocks__/
├── public/
├── tests/
│   ├── __tests__/
│   └── utils/
├── jest.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 テスト

プロジェクトには包括的なテストスイートが含まれています。

### テストの実行

```bash
# すべてのテストを実行
npm test

# カバレッジレポート付きで実行
npm run test:coverage
```

### テストカバレッジ

現在のテストカバレッジは以下の通りです：

- コンポーネントテスト: 100%
- ユーティリティ関数テスト: 77.5%
- アプリケーション全体: 約50%

## ⚙️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite 7
- **デスクトップアプリケーション**: Electron 28
- **手の検出**: MediaPipe Hands
- **テスト**: Jest + React Testing Library
- **コード品質**: ESLint + Prettier

## 🔧 開発

### コード品質

コードはESLintとPrettierを使用してフォーマットされています。コミット前に必ず以下のコマンドを実行してください：

```bash
npm run lint
npm run format
```

### ビルド

プロダクションビルドは以下のコマンドで実行できます：

```bash
npm run build
```

## 📝 開発状況

このプロジェクトは以下の改善を実施しました：

### セキュリティ強化
- Electronのセキュリティ設定を強化（contextIsolation, nodeIntegration）
- Preloadスクリプトで安全なAPI公開を実装
- レンダラープロセスのnodeIntegrationを無効化してセキュリティを向上

### 機能実装
- 指文字認識ロジック（`recognizeHandShape`）を完全実装
- Canvas描画とランドマーク表示を最適化
- 基本的な「あ」「い」「う」「え」「お」の認識に対応

### コード品質
- TypeScript型定義の改善（MediaPipe専用型定義ファイル作成）
- Electron API型定義を追加
- テストカバレッジを50%まで向上（ユーティリティ関数は77.5%）
- ESLint/Prettier設定の最新化
- 指文字認識パターンの重複解消

### ビルド最適化
- Vite 7対応のPreloadスクリプトビルド設定を修正
- 不要な依存関係を削除
- Viteビルド設定の最適化
- MediaPipeパッケージのローカルインストール化
- 開発用スクリプトを改善（concurrently使用）

すべてのテストがパスし、開発サーバーが正常に起動し、Electronアプリが正しくビルドされることを確認しています。

注意: UIはTailwind CSSユーティリティクラスを使用しています。Tailwindのセットアップが未導入の場合、見た目はプレーンになります（機能には影響しません）。

## 🤝 貢献

貢献は大歓迎です！以下の手順に従って貢献してください：

1. リポジトリをフォーク
2. featureブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

- 詳細は CONTRIBUTING.md を参照
- 行動規範は CODE_OF_CONDUCT.md を参照
- セキュリティ報告は SECURITY.md を参照

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 📧 連絡先

プロジェクトリンク: [https://github.com/SilentMalachite/finger-spell](https://github.com/SilentMalachite/finger-spell)

## ライセンス
MIT
