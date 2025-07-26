import { contextBridge, ipcRenderer } from 'electron';

// 安全なAPIのみをレンダラープロセスに公開
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('get-version'),
  // カメラ関連の安全なAPI
  requestCameraPermission: () => ipcRenderer.invoke('request-camera-permission'),
  // ファイル操作の安全なAPI（必要な場合）
  saveFile: (data: any) => ipcRenderer.invoke('save-file', data),
  loadFile: (path: string) => ipcRenderer.invoke('load-file', path),
});