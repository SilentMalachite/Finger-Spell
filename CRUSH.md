# 指文字変換アプリ 開発ガイド

## プロジェクト構成
- Electron + Vite + React (TypeScript)
- Webカメラ・MediaPipe・指文字認識ロジックをElectron上で実行
- エイリアス: `@` = src/, `~` = electron/

## 基本コマンド
```bash
# 開発
npm run dev              # Vite開発サーバー起動
npm run electron:dev     # Electronアプリをデバッグモードで起動

# テスト
npm test                 # すべてのテストを実行
npm run test:watch       # ウォッチモードでテスト実行
npm run test:coverage    # カバレッジ付きでテスト実行
npm test -- --testNamePattern="テスト名"  # 特定のテストを実行
npm test -- src/components/button/__tests__/Button.test.tsx  # ファイル単位でテスト実行

# 型チェックとLint
npm run type-check       # TypeScriptコンパイルチェック
npm run lint             # ESLint実行
npm run format           # Prettierでコードフォーマット

# ビルド
npm run build            # Reactアプリをビルド
npm run electron:build   # Electronアプリをビルド
```

## コーディング規約
- TypeScriptを厳格な型付けで使用
- Reactフックを使用した関数コンポーネント
- デフォルトエクスポートより名前付きエクスポートを推奨
- コンポーネントはPascalCase、変数/関数はcamelCase
- 厳格なESLintルール（react-hooks、react-refreshプラグイン）
- Prettierのデフォルト設定でフォーマット

## インポート規約
- src/ディレクトリは`@`エイリアスを使用（例: `import Component from '@/components/Component'`）
- 同一ディレクトリのファイルは相対インポート
- インポート順: node_modules、ローカルファイル
- インポート文はアルファベット順にソート

## MediaPipe/指文字認識固有の規約
- handRecognition.tsにMediaPipeのロジックを実装
- canvasDrawing.tsにキャンバス描画ロジックを実装
- fingerSpellingMap.tsに指文字マッピングを定義

## エラー処理
- 非同期操作にはtry/catchブロックを使用
- UIにはユーザーフレンドリーなエラーメッセージを表示
- 開発中はコンソールにエラーをログ出力

## Electron固有の考慮事項
- メインプロセスとレンダラープロセスの区別を明確に
- IPC通信を使用したプロセス間通信
- メインプロセスはelectron/ディレクトリに配置

## テスト
- ReactコンポーネントにはJestとTesting Libraryを使用
- `__tests__`ディレクトリにテストファイルを配置
- UIコンポーネントにはスナップショットテスト
- ユーティリティ関数には単体テスト
- テスト実行には`NODE_OPTIONS=--experimental-vm-modules`が必要