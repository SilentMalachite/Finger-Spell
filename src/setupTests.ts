// Jestのセットアップファイル
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Type declarations for global objects
declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder;
      TextDecoder: typeof TextDecoder;
      fetch: jest.Mock;
    }
  }
}

// Add TextEncoder and TextDecoder to global object
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = String(value);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

// Add localStorage mock to window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock fetch
global.fetch = jest.fn() as unknown as typeof global.fetch;

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Use fake timers for testing
jest.useFakeTimers();
