import { recognizeHandShape } from '../handRecognition';

describe('recognizeHandShape', () => {
  describe('基本的な指文字認識', () => {
    it('手のランドマークが空の場合は空文字を返す', () => {
      const result = recognizeHandShape([]);
      expect(result).toEqual({ letter: '', confidence: 0 });
    });

    it('nullまたはundefinedの場合は空文字を返す', () => {
      expect(recognizeHandShape(null as any)).toEqual({ letter: '', confidence: 0 });
      expect(recognizeHandShape(undefined as any)).toEqual({ letter: '', confidence: 0 });
    });

    it('不正なランドマーク数の場合は空文字を返す', () => {
      const landmarks = Array(10).fill({ x: 0, y: 0, z: 0 });
      const result = recognizeHandShape(landmarks);
      expect(result).toEqual({ letter: '', confidence: 0 });
    });

    it('正しい21個のランドマークで「あ」を認識できる', () => {
      // 「あ」の手形状をシミュレート（親指を立てる）
      const landmarks = createAHandShape();
      const result = recognizeHandShape(landmarks);
      expect(result.letter).toBe('A');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('正しい21個のランドマークで「い」を認識できる', () => {
      // 「い」の手形状をシミュレート（人差し指と小指を立てる）
      const landmarks = createIHandShape();
      const result = recognizeHandShape(landmarks);
      expect(result.letter).toBe('I');
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('信頼度の計算', () => {
    it('明確な手形状は高い信頼度を返す', () => {
      const landmarks = createAHandShape();
      const result = recognizeHandShape(landmarks);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('曖昧な手形状は低い信頼度を返す', () => {
      const landmarks = createAmbiguousHandShape();
      const result = recognizeHandShape(landmarks);
      expect(result.confidence).toBeLessThan(0.6);
    });
  });
});

// テスト用のヘルパー関数
function createAHandShape() {
  // 「あ」の手形状：親指を立てて、他の指は曲げる
  const landmarks = [];
  
  // 基本的な手の位置を設定
  const basePositions = {
    wrist: { x: 0.5, y: 0.8 },
    thumb: { base: { x: 0.4, y: 0.7 }, tip: { x: 0.3, y: 0.3 } },
    index: { base: { x: 0.45, y: 0.65 }, tip: { x: 0.45, y: 0.7 } },
    middle: { base: { x: 0.5, y: 0.65 }, tip: { x: 0.5, y: 0.7 } },
    ring: { base: { x: 0.55, y: 0.65 }, tip: { x: 0.55, y: 0.7 } },
    pinky: { base: { x: 0.6, y: 0.65 }, tip: { x: 0.6, y: 0.7 } }
  };

  // 手首
  landmarks[0] = { ...basePositions.wrist, z: 0 };
  
  // 親指（立てる）
  landmarks[1] = { x: basePositions.thumb.base.x, y: basePositions.thumb.base.y, z: 0 };
  landmarks[2] = { x: 0.35, y: 0.5, z: 0 };
  landmarks[3] = { x: 0.32, y: 0.4, z: 0 };
  landmarks[4] = { ...basePositions.thumb.tip, z: 0 };
  
  // 人差し指（曲げる）
  landmarks[5] = { ...basePositions.index.base, z: 0 };
  landmarks[6] = { x: 0.45, y: 0.68, z: 0 };
  landmarks[7] = { x: 0.45, y: 0.69, z: 0 };
  landmarks[8] = { ...basePositions.index.tip, z: 0 };
  
  // 中指（曲げる）
  landmarks[9] = { ...basePositions.middle.base, z: 0 };
  landmarks[10] = { x: 0.5, y: 0.68, z: 0 };
  landmarks[11] = { x: 0.5, y: 0.69, z: 0 };
  landmarks[12] = { ...basePositions.middle.tip, z: 0 };
  
  // 薬指（曲げる）
  landmarks[13] = { ...basePositions.ring.base, z: 0 };
  landmarks[14] = { x: 0.55, y: 0.68, z: 0 };
  landmarks[15] = { x: 0.55, y: 0.69, z: 0 };
  landmarks[16] = { ...basePositions.ring.tip, z: 0 };
  
  // 小指（曲げる）
  landmarks[17] = { ...basePositions.pinky.base, z: 0 };
  landmarks[18] = { x: 0.6, y: 0.68, z: 0 };
  landmarks[19] = { x: 0.6, y: 0.69, z: 0 };
  landmarks[20] = { ...basePositions.pinky.tip, z: 0 };
  
  return landmarks;
}

function createIHandShape() {
  // 「い」の手形状：人差し指と小指を立てる
  const landmarks = [];
  
  // 基本的な手の位置を設定
  const basePositions = {
    wrist: { x: 0.5, y: 0.8 },
    thumb: { base: { x: 0.4, y: 0.7 }, tip: { x: 0.4, y: 0.75 } },
    index: { base: { x: 0.45, y: 0.65 }, tip: { x: 0.45, y: 0.3 } },
    middle: { base: { x: 0.5, y: 0.65 }, tip: { x: 0.5, y: 0.7 } },
    ring: { base: { x: 0.55, y: 0.65 }, tip: { x: 0.55, y: 0.7 } },
    pinky: { base: { x: 0.6, y: 0.65 }, tip: { x: 0.6, y: 0.3 } }
  };

  // 手首
  landmarks[0] = { ...basePositions.wrist, z: 0 };
  
  // 親指（曲げる）
  landmarks[1] = { ...basePositions.thumb.base, z: 0 };
  landmarks[2] = { x: 0.4, y: 0.72, z: 0 };
  landmarks[3] = { x: 0.4, y: 0.74, z: 0 };
  landmarks[4] = { ...basePositions.thumb.tip, z: 0 };
  
  // 人差し指（立てる）
  landmarks[5] = { ...basePositions.index.base, z: 0 };
  landmarks[6] = { x: 0.45, y: 0.5, z: 0 };
  landmarks[7] = { x: 0.45, y: 0.4, z: 0 };
  landmarks[8] = { ...basePositions.index.tip, z: 0 };
  
  // 中指（曲げる）
  landmarks[9] = { ...basePositions.middle.base, z: 0 };
  landmarks[10] = { x: 0.5, y: 0.68, z: 0 };
  landmarks[11] = { x: 0.5, y: 0.69, z: 0 };
  landmarks[12] = { ...basePositions.middle.tip, z: 0 };
  
  // 薬指（曲げる）
  landmarks[13] = { ...basePositions.ring.base, z: 0 };
  landmarks[14] = { x: 0.55, y: 0.68, z: 0 };
  landmarks[15] = { x: 0.55, y: 0.69, z: 0 };
  landmarks[16] = { ...basePositions.ring.tip, z: 0 };
  
  // 小指（立てる）
  landmarks[17] = { ...basePositions.pinky.base, z: 0 };
  landmarks[18] = { x: 0.6, y: 0.5, z: 0 };
  landmarks[19] = { x: 0.6, y: 0.4, z: 0 };
  landmarks[20] = { ...basePositions.pinky.tip, z: 0 };
  
  return landmarks;
}

function createAmbiguousHandShape() {
  // 曖昧な手形状：すべての指が中途半端な位置
  const landmarks = [];
  
  for (let i = 0; i < 21; i++) {
    landmarks.push({
      x: 0.5 + (Math.random() - 0.5) * 0.2,
      y: 0.5 + (Math.random() - 0.5) * 0.1,
      z: Math.random() * 0.05
    });
  }
  
  return landmarks;
}