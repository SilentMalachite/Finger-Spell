import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// メインウィンドウの参照を保持
let mainWindow: BrowserWindow | null = null;

// アプリケーションの準備が完了したら呼び出される
const createWindow = async () => {
  // 新しいウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Finger Spell',
    // icon: path.join(__dirname, '../../public/icon.png'), // TODO: Add icon file
  });

  // 開発モードではデベロッパーツールを開く（Vite Dev Server検出）
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // アプリケーションのインデックスを読み込む
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// アプリケーションの初期化
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたときの処理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アクティブになったときの処理（macOS用）
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC通信の例
ipcMain.handle('get-version', () => {
  return app.getVersion();
});

// カメラ許可のダミー応答（実際の許可はレンダラーで行われます）
ipcMain.handle('request-camera-permission', async () => {
  return true;
});

// 簡易的なファイル保存処理
ipcMain.handle('save-file', async (_event, data: any) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '保存先を選択',
    filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }],
  });
  if (canceled || !filePath) return { success: false };
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
  return { success: true, path: filePath };
});

// 簡易的なファイル読込処理
ipcMain.handle('load-file', async (_event, filePath?: string) => {
  let target = filePath;
  if (!target) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'ファイルを選択',
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }],
    });
    if (canceled || filePaths.length === 0) return { success: false };
    target = filePaths[0];
  }
  const content = await fs.readFile(target!, 'utf-8');
  return { success: true, content };
});
