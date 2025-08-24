/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

describe('electron main IPC handlers', () => {
  it('registers expected IPC channels and creates BrowserWindow', async () => {
    // electron ESMモジュールを動的モック
    const handle = jest.fn();
    const openDevTools = jest.fn();
    const loadURL = jest.fn(async () => {});
    const loadFile = jest.fn(async () => {});
    const on = jest.fn();

    const BrowserWindow = jest.fn().mockImplementation((_opts) => ({
      webContents: { openDevTools },
      loadURL,
      loadFile,
      on,
    }));

    const whenReady = jest.fn().mockResolvedValue(undefined);
    const app = {
      whenReady,
      getVersion: jest.fn().mockReturnValue('0.0.0-test'),
      on: jest.fn(),
      quit: jest.fn(),
    } as unknown as Electron.App;

    const dialog = {
      showSaveDialog: jest.fn().mockResolvedValue({ canceled: true, filePath: undefined }),
      showOpenDialog: jest.fn().mockResolvedValue({ canceled: true, filePaths: [] }),
    };

    await jest.unstable_mockModule('electron', () => ({
      __esModule: true,
      app,
      BrowserWindow: Object.assign(BrowserWindow, { getAllWindows: jest.fn().mockReturnValue([]) }),
      ipcMain: { handle },
      dialog,
    }));

    // devサーバーURLの有無で分岐するため、ここでは未設定にする
    delete (process.env as any).VITE_DEV_SERVER_URL;

    // モジュールをインポート（副作用でwhenReady().then(createWindow)が実行される）
    await import('~/main.ts');

    const electron = await import('electron');
    const { ipcMain } = electron as unknown as { ipcMain: { handle: jest.Mock } };

    // IPC登録の検証
    const channels = ipcMain.handle.mock.calls.map((c) => c[0]);
    expect(channels).toEqual(
      expect.arrayContaining([
        'get-version',
        'request-camera-permission',
        'save-file',
        'load-file',
      ])
    );

    // ウィンドウ作成の検証
    expect(BrowserWindow).toHaveBeenCalled();
    const call = BrowserWindow.mock.calls[0];
    const options = call[0];
    expect(options).toMatchObject({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
      },
      title: 'Finger Spell',
    });
  });
});
