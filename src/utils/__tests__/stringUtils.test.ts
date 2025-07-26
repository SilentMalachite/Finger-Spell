import { describe, it, expect } from '@jest/globals';
import { truncate, isValidEmail, isValidUrl } from '../stringUtils';

describe('stringUtils', () => {
  describe('truncate', () => {
    it('文字列が指定された長さを超えない場合はそのまま返す', () => {
      expect(truncate('Hello, World!', 20)).toBe('Hello, World!');
    });

    it('文字列が指定された長さを超える場合は切り詰めて省略記号を付ける', () => {
      expect(truncate('Hello, World!', 5)).toBe('He...');
    });

    it('カスタムの省略記号を指定できる', () => {
      expect(truncate('Hello, World!', 5, '~~~')).toBe('He~~~');
    });
  });

  describe('isValidEmail', () => {
    it('有効なメールアドレスを正しく検証する', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.jp')).toBe(true);
    });

    it('無効なメールアドレスを正しく検証する', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('有効なURLを正しく検証する', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=string')).toBe(true);
    });

    it('無効なURLを正しく検証する', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('htp://example.com')).toBe(false);
    });
  });
});
