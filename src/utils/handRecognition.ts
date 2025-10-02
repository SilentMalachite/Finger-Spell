interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface RecognitionResult {
  letter: string;
  confidence: number;
  voicing?: 'none' | 'voiced' | 'semi-voiced';
  isSmall?: boolean;
}

// 濁音・半濁音・小書き文字検出機能を追加
import { detectVoicingType, detectSmallCharacter } from './voicingDetection';

// MediaPipe Handsのランドマークインデックス
const LANDMARK_INDICES = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

export function recognizeHandShape(landmarks: Landmark[]): RecognitionResult {
  try {
    if (!landmarks || landmarks.length !== 21) {
      console.warn('Invalid landmarks provided:', landmarks?.length || 'null/undefined');
      return { letter: '', confidence: 0 };
    }

    // ランドマークの妥当性をチェック
    const invalidLandmarks = landmarks.filter(lm => 
      lm.x < 0 || lm.x > 1 || lm.y < 0 || lm.y > 1 || 
      isNaN(lm.x) || isNaN(lm.y) || isNaN(lm.z)
    );
    
    if (invalidLandmarks.length > 0) {
      console.warn('Invalid landmark coordinates detected:', invalidLandmarks.length);
      return { letter: '', confidence: 0 };
    }
  } catch (error) {
    console.error('Error in recognizeHandShape:', error);
    return { letter: '', confidence: 0 };
  }

  // 各指が立っているかどうかを判定
  const fingerStates = {
    thumb: isFingerUp(landmarks, 'thumb'),
    index: isFingerUp(landmarks, 'index'),
    middle: isFingerUp(landmarks, 'middle'),
    ring: isFingerUp(landmarks, 'ring'),
    pinky: isFingerUp(landmarks, 'pinky'),
  };

  // 指の状態から文字を判定
  const { letter, confidence } = matchFingerPattern(fingerStates);

  // 濁音・半濁音・小書き文字の検出
  const voicing = detectVoicingType(landmarks);
  const isSmall = detectSmallCharacter(landmarks);

  return { letter, confidence, voicing, isSmall };
}

function isFingerUp(landmarks: Landmark[], finger: string): boolean {
  let tipIndex: number;
  let pipIndex: number;
  let mcpIndex: number;

  switch (finger) {
    case 'thumb':
      tipIndex = LANDMARK_INDICES.THUMB_TIP;
      pipIndex = LANDMARK_INDICES.THUMB_IP;
      mcpIndex = LANDMARK_INDICES.THUMB_MCP;
      break;
    case 'index':
      tipIndex = LANDMARK_INDICES.INDEX_TIP;
      pipIndex = LANDMARK_INDICES.INDEX_PIP;
      mcpIndex = LANDMARK_INDICES.INDEX_MCP;
      break;
    case 'middle':
      tipIndex = LANDMARK_INDICES.MIDDLE_TIP;
      pipIndex = LANDMARK_INDICES.MIDDLE_PIP;
      mcpIndex = LANDMARK_INDICES.MIDDLE_MCP;
      break;
    case 'ring':
      tipIndex = LANDMARK_INDICES.RING_TIP;
      pipIndex = LANDMARK_INDICES.RING_PIP;
      mcpIndex = LANDMARK_INDICES.RING_MCP;
      break;
    case 'pinky':
      tipIndex = LANDMARK_INDICES.PINKY_TIP;
      pipIndex = LANDMARK_INDICES.PINKY_PIP;
      mcpIndex = LANDMARK_INDICES.PINKY_MCP;
      break;
    default:
      return false;
  }

  // 指が立っているかどうかは、先端のy座標が関節より上にあるかで判定
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];
  const mcp = landmarks[mcpIndex];

  // 親指は横方向の動きも考慮
  if (finger === 'thumb') {
    return tip.y < pip.y && Math.abs(tip.x - mcp.x) > 0.1;
  }

  // その他の指は垂直方向の動きで判定
  return tip.y < pip.y && pip.y < mcp.y;
}

function matchFingerPattern(fingerStates: Record<string, boolean>): RecognitionResult {
  const patterns = [
    // あ行 - 各文字を特徴的な形に修正
    {
      letter: 'A',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'I',
      pattern: { thumb: false, index: false, middle: false, ring: false, pinky: true },
      confidence: 0.9,
    },
    {
      letter: 'U',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'E',
      pattern: { thumb: false, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.85,
    },
    {
      letter: 'O',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.85,
    },

    // か行 - 重複を解消
    {
      letter: 'KA',
      pattern: { thumb: false, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.8,
    },
    {
      letter: 'KI',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'KU',
      pattern: { thumb: false, index: false, middle: false, ring: true, pinky: true },
      confidence: 0.8,
    },
    {
      letter: 'KE',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: true },
      confidence: 0.85,
    },
    {
      letter: 'KO',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.8,
    },

    // さ行 - 重複を解消
    {
      letter: 'SA',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'SHI',
      pattern: { thumb: true, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'SU',
      pattern: { thumb: false, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.8,
    },
    {
      letter: 'SE',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.75,
    },
    {
      letter: 'SO',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.75,
    },

    // た行 - 重複を解消
    {
      letter: 'TA',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.8,
    },
    {
      letter: 'CHI',
      pattern: { thumb: true, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'TSU',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'TE',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'TO',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.75,
    },

    // な行 - 重複を解消
    {
      letter: 'NA',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.7,
    },
    {
      letter: 'NI',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'NU',
      pattern: { thumb: true, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.75,
    },
    {
      letter: 'NE',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'NO',
      pattern: { thumb: true, index: true, middle: true, ring: false, pinky: true },
      confidence: 0.7,
    },

    // は行 - 重複を解消
    {
      letter: 'HA',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'HI',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'FU',
      pattern: { thumb: false, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'HE',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.7,
    },
    {
      letter: 'HO',
      pattern: { thumb: true, index: true, middle: true, ring: false, pinky: true },
      confidence: 0.7,
    },

    // ま行 - 重複を解消
    {
      letter: 'MA',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'MI',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'MU',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.8,
    },
    {
      letter: 'ME',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'MO',
      pattern: { thumb: true, index: true, middle: true, ring: false, pinky: true },
      confidence: 0.7,
    },

    // や行 - 重複を解消
    {
      letter: 'YA',
      pattern: { thumb: false, index: false, middle: false, ring: false, pinky: true },
      confidence: 0.85,
    },
    {
      letter: 'YU',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: true },
      confidence: 0.85,
    },
    {
      letter: 'YO',
      pattern: { thumb: true, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },

    // ら行 - 重複を解消
    {
      letter: 'RA',
      pattern: { thumb: false, index: false, middle: false, ring: false, pinky: true },
      confidence: 0.8,
    },
    {
      letter: 'RI',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'RU',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'RE',
      pattern: { thumb: false, index: false, middle: false, ring: true, pinky: false },
      confidence: 0.8,
    },
    {
      letter: 'RO',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.7,
    },

    // わ行 - 重複を解消
    {
      letter: 'WA',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'WI',
      pattern: { thumb: true, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.7,
    },
    {
      letter: 'WE',
      pattern: { thumb: true, index: true, middle: true, ring: false, pinky: true },
      confidence: 0.7,
    },
    {
      letter: 'WO',
      pattern: { thumb: true, index: true, middle: false, ring: true, pinky: true },
      confidence: 0.7,
    },

    // ん
    {
      letter: 'N',
      pattern: { thumb: false, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
  ];

  // パターンマッチングを最適化
  // 指の状態を数値に変換してハッシュ化
  const fingerHash = (fingerStates.thumb ? 1 : 0) << 4 |
                    (fingerStates.index ? 1 : 0) << 3 |
                    (fingerStates.middle ? 1 : 0) << 2 |
                    (fingerStates.ring ? 1 : 0) << 1 |
                    (fingerStates.pinky ? 1 : 0);

  // パターンハッシュマップを作成（事前計算）
  const patternMap = new Map<number, { letter: string; confidence: number }>();
  patterns.forEach(({ letter, pattern, confidence }) => {
    const patternHash = (pattern.thumb ? 1 : 0) << 4 |
                       (pattern.index ? 1 : 0) << 3 |
                       (pattern.middle ? 1 : 0) << 2 |
                       (pattern.ring ? 1 : 0) << 1 |
                       (pattern.pinky ? 1 : 0);
    patternMap.set(patternHash, { letter, confidence });
  });

  // 完全一致をチェック
  const exactMatch = patternMap.get(fingerHash);
  if (exactMatch) {
    return exactMatch;
  }

  // 部分一致を探す（ハミング距離ベース）
  let bestMatch = { letter: '', confidence: 0 };
  for (const [patternHash, { letter, confidence }] of patternMap) {
    const hammingDistance = (fingerHash ^ patternHash).toString(2).split('1').length - 1;
    const matchRatio = (5 - hammingDistance) / 5;
    const adjustedConfidence = confidence * matchRatio * 0.7;

    if (adjustedConfidence > bestMatch.confidence) {
      bestMatch = { letter, confidence: adjustedConfidence };
    }
  }

  return bestMatch;
}