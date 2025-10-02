import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.test.json' with { type: 'json' };
const compilerOptions = {
  paths: {
    "@/*": ["./src/*"]
  }
};

const config: Config = {
  // テスト環境（ブラウザ環境のテスト用）
  testEnvironment: 'jsdom',
  
  // Reactの開発ビルドを使用するための環境変数
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // テストファイルのマッチパターン
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // モジュールのパスエイリアス（tsconfig.jsonのpathsと合わせる）
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/electron/$1',
    // CSSや画像などのモジュールをモック化
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // JSLFingerSpelling モジュールのモック
    '^.*jsl_fingerspelling.*$': '<rootDir>/src/__mocks__/jsl_fingerspelling.ts'
  },
  
  // テストカバレッジの設定
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/**/index.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  
  
  // TypeScriptの設定
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // モジュールの拡張子
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // テスト実行時のタイムアウト（ミリ秒）
  testTimeout: 10000,
  
  // テストレポーターの設定
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
        ancestorSeparator: ' > ',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ]
  ],
  
  // グローバル変数
  // ts-jestの非推奨警告を避けるための設定
  transformIgnorePatterns: [
    'node_modules/(?!(@mediapipe)/)'
  ],
};

export default config;
