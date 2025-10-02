interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface HandPosition {
  x: number;
  y: number;
  z: number;
}

// 手の位置を検出する関数
export function detectHandPosition(landmarks: Landmark[]): HandPosition {
  if (!landmarks || landmarks.length < 21) {
    return { x: 0.5, y: 0.5, z: 0 };
  }

  // 手首（WRIST）の位置を基準とする
  const wrist = landmarks[0];
  return {
    x: wrist.x,
    y: wrist.y,
    z: wrist.z
  };
}

// 濁音/半濁音の判定
export function detectVoicingType(landmarks: Landmark[]): 'none' | 'voiced' | 'semi-voiced' {
  const position = detectHandPosition(landmarks);

  // 画面の中心座標（0.5）を基準に位置を判定
  const centerX = 0.5;
  const centerY = 0.5;

  // X座標が中心より右側（外側）にある場合 -> 濁音
  if (position.x > centerX + 0.1) {
    return 'voiced';
  }

  // Y座標が中心より上側にある場合 -> 半濁音
  if (position.y < centerY - 0.1) {
    return 'semi-voiced';
  }

  // それ以外は通常音
  return 'none';
}

// 小書き文字の判定
export function detectSmallCharacter(landmarks: Landmark[]): boolean {
  const position = detectHandPosition(landmarks);

  // 体に近い位置（中心側）にある場合 -> 小書き文字
  if (position.x < 0.4) {
    return true;
  }

  return false;
}

// 濁音マップ
export const voicedMap: Record<string, string> = {
  'KA': 'GA', 'KI': 'GI', 'KU': 'GU', 'KE': 'GE', 'KO': 'GO',
  'SA': 'ZA', 'SHI': 'JI', 'SU': 'ZU', 'SE': 'ZE', 'SO': 'ZO',
  'TA': 'DA', 'CHI': 'DI', 'TSU': 'DU', 'TE': 'DE', 'TO': 'DO',
  'HA': 'BA', 'HI': 'BI', 'FU': 'BU', 'HE': 'BE', 'HO': 'BO'
};

// 半濁音マップ
export const semiVoicedMap: Record<string, string> = {
  'HA': 'PA', 'HI': 'PI', 'FU': 'PU', 'HE': 'PE', 'HO': 'PO'
};

// ベース文字を取得（濁音・半濁音から元の文字に）
export function getBaseCharacter(character: string): string {
  for (const [base, voiced] of Object.entries(voicedMap)) {
    if (voiced === character) return base;
  }
  for (const [base, semiVoiced] of Object.entries(semiVoicedMap)) {
    if (semiVoiced === character) return base;
  }
  return character;
}

// 完全な文字判定（濁音・半濁音・小書き文字を考慮）
export function getCompleteCharacter(baseLetter: string, landmarks: Landmark[]): string {
  const voicingType = detectVoicingType(landmarks);

  let character = baseLetter;

  // 濁音の適用
  if (voicingType === 'voiced' && voicedMap[baseLetter]) {
    character = voicedMap[baseLetter];
  }

  // 半濁音の適用
  if (voicingType === 'semi-voiced' && semiVoicedMap[baseLetter]) {
    character = semiVoicedMap[baseLetter];
  }

  // 小書き文字の適用（今後の拡張用）
  // TODO: 小書き文字のマップを追加

  return character;
}