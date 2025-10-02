import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 環境変数をロード
  const env = loadEnv(mode, process.cwd(), '');
  
  // ビルド時のみdistディレクトリをクリーンアップ
  if (command === 'build' && existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }
  
  // Gitのコミットハッシュを取得
  const commitHash = (() => {
    try {
      return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (e) {
      return 'unknown';
    }
  })();

  return {
    define: {
      // ビルド時に環境変数をクライアントサイドで使用可能に
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __COMMIT_HASH__: JSON.stringify(commitHash),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    plugins: [
      react(),
      electron({
        // メインプロセスのエントリーポイント
        entry: 'electron/main.ts',
        // preload スクリプトもビルド対象に含める
        preload: {
          input: 'electron/preload.ts',
          // 出力先はメインと同じディレクトリに揃える
          vite: {
            build: {
              outDir: 'dist/electron',
              minify: mode !== 'development',
              sourcemap: mode === 'development' ? 'inline' : false,
              rollupOptions: {
                external: ['electron'],
                output: {
                  entryFileNames: 'preload.js',
                },
              },
            },
          },
        },
        onstart: (options) => {
          if (process.env.VSCODE_DEBUG) {
            console.log('[startup] Electron App');
          } else {
            options.startup();
          }
        },
        vite: {
          build: {
            outDir: 'dist/electron',
            minify: mode !== 'development',
            sourcemap: mode === 'development' ? 'inline' : false,
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
              },
            },
          },
        },
      }),
      // レンダラープロセス用のプラグイン
      renderer({
        nodeIntegration: true,
      }),
    ],
    base: './',
    build: {
      outDir: 'dist/renderer',
      emptyOutDir: true,
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode === 'development',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mediapipe: ['@mediapipe/hands', '@mediapipe/camera_utils'],
          },
        },
      },
      // 大きな静的アセットを別ファイルとして出力
      assetsInlineLimit: 4096,
      // 本番ビルド時にconsole.logを削除
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'electron'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      // ホットリロードの設定
      watch: {
        usePolling: true,
        interval: 100,
      },
      // MediaPipeファイルを静的ファイルとして提供
      fs: {
        allow: ['..', 'node_modules/@mediapipe']
      }
    },
    // 開発サーバー起動時にブラウザを開く
    preview: {
      port: 4173,
      strictPort: true,
    },
    // 環境変数のプレフィックス
    envPrefix: ['VITE_', 'ELECTRON_'],
  };
});
