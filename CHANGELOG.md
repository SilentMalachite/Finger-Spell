# 変更履歴

すべての重要な変更は、このファイルに記録されます。

フォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づき、
[Semantic Versioning](https://semver.org/lang/ja/spec/v2.0.0.html)を用いてバージョン管理を行います。

## [0.1.0] - 2025-07-26

### 追加
- プロジェクトの初期リリース
- Electron + Vite + React (TypeScript) による指文字認識アプリケーション
- Webカメラを使用したリアルタイム指文字認識機能
- MediaPipe Handsによる手のランドマーク検出
- ひらがなの50音すべてに対応
- アクセシビリティ対応
- クロスプラットフォーム対応 (Windows, macOS, Linux)

### 変更
- プロジェクト名をFinger-spellに変更
- srcディレクトリ以下の構造を整理（コンポーネント、サービス等の分離）
- 不要ファイル・ディレクトリの整理
- バージョン・依存関係の問題を完全に解決
- テスト環境の構築とテストカバレッジの向上
- npm脆弱性・警告への対応
- ビルド設定の最適化
- セキュリティ設定の見直し

### 修正
- Jestのモジュール解決エラーを修正
- Reactのstate update警告を修正
- テストのモック適用を修正

### セキュリティ
- npm audit fix --forceで脆弱性を修正
