import { jest } from '@jest/globals';
import { 
  detectHandPosition, 
  detectVoicingType, 
  detectSmallCharacter, 
  getCompleteCharacter,
  voicedMap,
  semiVoicedMap,
  smallCharacterMap,
  getBaseCharacter
} from '../voicingDetection';
import type { Landmark } from '@mediapipe/hands';

describe('voicingDetection', () => {
  describe('detectHandPosition', () => {
    it('正常なランドマークで手の位置を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map((_, i) => ({
        x: 0.5 + i * 0.01,
        y: 0.5 + i * 0.01,
        z: 0
      }));

      const position = detectHandPosition(landmarks);
      expect(position.x).toBe(0.5);
      expect(position.y).toBe(0.5);
      expect(position.z).toBe(0);
    });

    it('不正なランドマークでデフォルト位置を返す', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      
      const position = detectHandPosition([]);
      expect(position.x).toBe(0.5);
      expect(position.y).toBe(0.5);
      expect(position.z).toBe(0);
      
      consoleSpy.mockRestore();
    });

    it('NaN座標でデフォルト位置を返す', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: NaN,
        y: NaN,
        z: NaN
      }));

      const position = detectHandPosition(landmarks);
      expect(position.x).toBe(0.5);
      expect(position.y).toBe(0.5);
      expect(position.z).toBe(0);
      
      consoleSpy.mockRestore();
    });

    it('座標を0-1の範囲にクランプする', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 1.5,
        y: -0.5,
        z: 0
      }));

      const position = detectHandPosition(landmarks);
      expect(position.x).toBe(1);
      expect(position.y).toBe(0);
    });
  });

  describe('detectVoicingType', () => {
    it('通常音を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.5,
        y: 0.5,
        z: 0
      }));

      const voicingType = detectVoicingType(landmarks);
      expect(voicingType).toBe('none');
    });

    it('濁音を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.7, // 右側（外側）
        y: 0.5,
        z: 0
      }));

      const voicingType = detectVoicingType(landmarks);
      expect(voicingType).toBe('voiced');
    });

    it('半濁音を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.5,
        y: 0.3, // 上側
        z: 0
      }));

      const voicingType = detectVoicingType(landmarks);
      expect(voicingType).toBe('semi-voiced');
    });

    it('不正なランドマークでnoneを返す', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      
      const voicingType = detectVoicingType([]);
      expect(voicingType).toBe('none');
      
      consoleSpy.mockRestore();
    });
  });

  describe('detectSmallCharacter', () => {
    it('小書き文字を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.3, // 左側（体に近い）
        y: 0.5,
        z: 0
      }));

      const isSmall = detectSmallCharacter(landmarks);
      expect(isSmall).toBe(true);
    });

    it('通常文字を検出する', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.6, // 右側（体から遠い）
        y: 0.5,
        z: 0
      }));

      const isSmall = detectSmallCharacter(landmarks);
      expect(isSmall).toBe(false);
    });

    it('不正なランドマークでfalseを返す', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      
      const isSmall = detectSmallCharacter([]);
      expect(isSmall).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe('getCompleteCharacter', () => {
    it('通常文字を返す', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.5,
        y: 0.5,
        z: 0
      }));

      const character = getCompleteCharacter('KA', landmarks);
      expect(character).toBe('KA');
    });

    it('濁音文字を返す', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.7, // 濁音位置
        y: 0.5,
        z: 0
      }));

      const character = getCompleteCharacter('KA', landmarks);
      expect(character).toBe('GA');
    });

    it('半濁音文字を返す', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.5,
        y: 0.3, // 半濁音位置
        z: 0
      }));

      const character = getCompleteCharacter('HA', landmarks);
      expect(character).toBe('PA');
    });

    it('小書き文字を返す', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.3, // 小書き文字位置
        y: 0.5,
        z: 0
      }));

      const character = getCompleteCharacter('A', landmarks);
      expect(character).toBe('ぁ');
    });

    it('小書き文字が最優先される', () => {
      const landmarks: Landmark[] = Array(21).fill(null).map(() => ({
        x: 0.3, // 小書き文字位置
        y: 0.3, // 半濁音位置
        z: 0
      }));

      const character = getCompleteCharacter('A', landmarks);
      expect(character).toBe('ぁ'); // 小書き文字が優先
    });
  });

  describe('getBaseCharacter', () => {
    it('濁音からベース文字を取得する', () => {
      expect(getBaseCharacter('GA')).toBe('KA');
      expect(getBaseCharacter('ZA')).toBe('SA');
      expect(getBaseCharacter('DA')).toBe('TA');
      expect(getBaseCharacter('BA')).toBe('HA');
    });

    it('半濁音からベース文字を取得する', () => {
      expect(getBaseCharacter('PA')).toBe('HA');
      expect(getBaseCharacter('PI')).toBe('HI');
    });

    it('ベース文字はそのまま返す', () => {
      expect(getBaseCharacter('KA')).toBe('KA');
      expect(getBaseCharacter('A')).toBe('A');
    });
  });

  describe('マップの整合性', () => {
    it('濁音マップが正しく定義されている', () => {
      expect(voicedMap['KA']).toBe('GA');
      expect(voicedMap['SA']).toBe('ZA');
      expect(voicedMap['TA']).toBe('DA');
      expect(voicedMap['HA']).toBe('BA');
    });

    it('半濁音マップが正しく定義されている', () => {
      expect(semiVoicedMap['HA']).toBe('PA');
      expect(semiVoicedMap['HI']).toBe('PI');
    });

    it('小書き文字マップが正しく定義されている', () => {
      expect(smallCharacterMap['A']).toBe('ぁ');
      expect(smallCharacterMap['I']).toBe('ぃ');
      expect(smallCharacterMap['YA']).toBe('ゃ');
      expect(smallCharacterMap['TSU']).toBe('っ');
    });
  });
});
