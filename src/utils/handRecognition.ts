interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface RecognitionResult {
  letter: string;
  confidence: number;
}

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
  if (!landmarks || landmarks.length !== 21) {
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

  return { letter, confidence };
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
    {
      letter: 'A',
      pattern: { thumb: true, index: false, middle: false, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'I',
      pattern: { thumb: false, index: true, middle: false, ring: false, pinky: true },
      confidence: 0.9,
    },
    {
      letter: 'U',
      pattern: { thumb: false, index: true, middle: true, ring: false, pinky: false },
      confidence: 0.9,
    },
    {
      letter: 'E',
      pattern: { thumb: false, index: true, middle: true, ring: true, pinky: false },
      confidence: 0.85,
    },
    {
      letter: 'O',
      pattern: { thumb: true, index: true, middle: false, ring: false, pinky: false },
      confidence: 0.85,
    },
  ];

  // パターンマッチング
  for (const { letter, pattern, confidence } of patterns) {
    const matches = Object.keys(pattern).every(
      (finger) => fingerStates[finger as keyof typeof fingerStates] === pattern[finger as keyof typeof pattern]
    );

    if (matches) {
      // 完全一致の場合は高い信頼度を返す
      return { letter, confidence };
    }
  }

  // 部分一致を探す
  let bestMatch = { letter: '', confidence: 0 };
  for (const { letter, pattern, confidence } of patterns) {
    const matchCount = Object.keys(pattern).filter(
      (finger) => fingerStates[finger as keyof typeof fingerStates] === pattern[finger as keyof typeof pattern]
    ).length;
    
    const matchRatio = matchCount / Object.keys(pattern).length;
    const adjustedConfidence = confidence * matchRatio * 0.7; // 部分一致は信頼度を下げる

    if (adjustedConfidence > bestMatch.confidence) {
      bestMatch = { letter, confidence: adjustedConfidence };
    }
  }

  return bestMatch;
}