/// <reference types="vite/client" />

// Electron API types
interface ElectronAPI {
  getVersion: () => Promise<string>;
  requestCameraPermission: () => Promise<boolean>;
  saveFile: (data: any) => Promise<{ success: boolean; path?: string }>;
  loadFile: (path?: string) => Promise<{ success: boolean; content?: string }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
