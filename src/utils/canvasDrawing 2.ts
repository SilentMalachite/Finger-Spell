import type { Landmark } from '@mediapipe/hands';

// ランドマーク間の接続定義
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // 親指
  [0, 5], [5, 6], [6, 7], [7, 8],           // 人差し指
  [0, 9], [9, 10], [10, 11], [11, 12],      // 中指
  [0, 13], [13, 14], [14, 15], [15, 16],    // 薬指
  [0, 17], [17, 18], [18, 19], [19, 20],    // 小指
  [5, 9], [9, 13], [13, 17],                // 手のひら
];

export function drawHandLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  canvas: HTMLCanvasElement
): void {
  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 接続線を描画
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  
  HAND_CONNECTIONS.forEach(([start, end]) => {
    const startLandmark = landmarks[start];
    const endLandmark = landmarks[end];
    
    ctx.beginPath();
    ctx.moveTo(startLandmark.x * canvas.width, startLandmark.y * canvas.height);
    ctx.lineTo(endLandmark.x * canvas.width, endLandmark.y * canvas.height);
    ctx.stroke();
  });

  // ランドマークポイントを描画
  landmarks.forEach((landmark, index) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    
    // ポイントの色を指先は赤、その他は緑に
    if ([4, 8, 12, 16, 20].includes(index)) {
      ctx.fillStyle = '#FF0000'; // 指先は赤
    } else {
      ctx.fillStyle = '#00FF00'; // その他は緑
    }
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}

// パフォーマンス最適化のためのデバウンス処理
export function createDebounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null;
  
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}