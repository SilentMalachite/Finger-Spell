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
  try {
    if (!landmarks || landmarks.length < 21) {
      console.warn('Invalid landmarks for position detection:', landmarks?.length || 'null/undefined');
      return { x: 0.5, y: 0.5, z: 0 };
    }

    // 手首（WRIST）の位置を基準とする
    const wrist = landmarks[0];
    
    // 座標の妥当性をチェック
    if (isNaN(wrist.x) || isNaN(wrist.y) || isNaN(wrist.z)) {
      console.warn('Invalid wrist coordinates:', wrist);
      return { x: 0.5, y: 0.5, z: 0 };
    }

    return {
      x: Math.max(0, Math.min(1, wrist.x)), // 0-1の範囲にクランプ
      y: Math.max(0, Math.min(1, wrist.y)),
      z: wrist.z
    };
  } catch (error) {
    console.error('Error in detectHandPosition:', error);
    return { x: 0.5, y: 0.5, z: 0 };
  }
}

// 濁音/半濁音の判定
export function detectVoicingType(landmarks: Landmark[]): 'none' | 'voiced' | 'semi-voiced' {
  try {
    const position = detectHandPosition(landmarks);

    // 画面の中心座標（0.5）を基準に位置を判定
    const centerX = 0.5;
    const centerY = 0.5;

    // 手のサイズを計算（手首から中指の先端までの距離）
    const wrist = landmarks[0];
    const middleTip = landmarks[12];
    
    if (!wrist || !middleTip) {
      console.warn('Missing wrist or middle tip landmarks');
      return 'none';
    }
    
    const handSize = Math.sqrt(
      Math.pow(middleTip.x - wrist.x, 2) + 
      Math.pow(middleTip.y - wrist.y, 2)
    );

    // 動的な閾値を計算（手のサイズに基づく）
    const dynamicThreshold = Math.max(0.05, handSize * 0.3);

    // X座標が中心より右側（外側）にある場合 -> 濁音
    if (position.x > centerX + dynamicThreshold) {
      return 'voiced';
    }

    // Y座標が中心より上側にある場合 -> 半濁音
    if (position.y < centerY - dynamicThreshold) {
      return 'semi-voiced';
    }

    // それ以外は通常音
    return 'none';
  } catch (error) {
    console.error('Error in detectVoicingType:', error);
    return 'none';
  }
}

// 小書き文字の判定
export function detectSmallCharacter(landmarks: Landmark[]): boolean {
  try {
    const position = detectHandPosition(landmarks);

    // 手のサイズを計算（手首から中指の先端までの距離）
    const wrist = landmarks[0];
    const middleTip = landmarks[12];
    
    if (!wrist || !middleTip) {
      console.warn('Missing wrist or middle tip landmarks for small character detection');
      return false;
    }
    
    const handSize = Math.sqrt(
      Math.pow(middleTip.x - wrist.x, 2) + 
      Math.pow(middleTip.y - wrist.y, 2)
    );

    // 動的な閾値を計算（手のサイズに基づく）
    const dynamicThreshold = Math.max(0.1, handSize * 0.4);

    // 体に近い位置（中心側）にある場合 -> 小書き文字
    if (position.x < 0.5 - dynamicThreshold) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in detectSmallCharacter:', error);
    return false;
  }
}

// 小書き文字マップ
export const smallCharacterMap: Record<string, string> = {
  'A': 'ぁ', 'I': 'ぃ', 'U': 'ぅ', 'E': 'ぇ', 'O': 'ぉ',
  'YA': 'ゃ', 'YU': 'ゅ', 'YO': 'ょ',
  'TSU': 'っ', 'WA': 'ゎ'
};

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
  const isSmall = detectSmallCharacter(landmarks);

  let character = baseLetter;

  // 小書き文字の適用（最優先）
  if (isSmall && smallCharacterMap[baseLetter]) {
    character = smallCharacterMap[baseLetter];
  }
  // 濁音の適用
  else if (voicingType === 'voiced' && voicedMap[baseLetter]) {
    character = voicedMap[baseLetter];
  }
  // 半濁音の適用
  else if (voicingType === 'semi-voiced' && semiVoicedMap[baseLetter]) {
    character = semiVoicedMap[baseLetter];
  }

  return character;
}