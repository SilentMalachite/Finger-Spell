import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Play, Pause } from 'lucide-react';
import { fingerSpellingMap } from '../fingerSpellingMap';
import { recognizeHandShape } from '../utils/handRecognition';
import { getCompleteCharacter } from '../utils/voicingDetection';
import { drawHandLandmarks } from '../utils/canvasDrawing';
import type { Hands, HandsResults, Landmark } from '@mediapipe/hands';
import type { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';

type FingerSpellingKey = keyof typeof fingerSpellingMap;

const JSLFingerSpelling = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [handLandmarks, setHandLandmarks] = useState<Landmark[] | null>(null);
  const [error, setError] = useState('');
  const handsRef = useRef<(Hands & { lastProcessTime?: number }) | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);
  const assetBaseRef = useRef<string | null>(null);

  const resolveHandsAssetBase = useCallback(async () => {
    if (assetBaseRef.current) {
      return assetBaseRef.current;
    }

    const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);
    const baseFromEnv = ensureTrailingSlash(import.meta.env.BASE_URL ?? '/');
    const candidates: string[] = [];

    if (import.meta.env.DEV) {
      candidates.push(ensureTrailingSlash('/node_modules/@mediapipe/hands'));
    }

    candidates.push(ensureTrailingSlash(`${baseFromEnv}mediapipe/hands`));
    candidates.push(ensureTrailingSlash('https://cdn.jsdelivr.net/npm/@mediapipe/hands'));

    const isHttpProtocol = window.location.protocol.startsWith('http');
    const testAsset = 'hands_solution_packed_assets.data';

    const toAbsoluteUrl = (base: string) => {
      if (base.startsWith('http')) {
        return base;
      }
      if (base.startsWith('/')) {
        return `${window.location.origin}${base}`;
      }
      return new URL(base, window.location.href).toString();
    };

    for (const candidate of candidates) {
      if (window.location.protocol === 'file:' && candidate.startsWith('./')) {
        assetBaseRef.current = candidate;
        return candidate;
      }

      if (!isHttpProtocol) {
        assetBaseRef.current = candidate;
        return candidate;
      }

      try {
        const absoluteBase = toAbsoluteUrl(candidate);
        const response = await fetch(`${absoluteBase}${testAsset}`, { method: 'HEAD' });
        if (response.ok) {
          assetBaseRef.current = candidate;
          return candidate;
        }
      } catch (assetError) {
        console.warn('MediaPipe asset確認に失敗:', candidate, assetError);
      }
    }

    const fallback = candidates[candidates.length - 1];
    assetBaseRef.current = fallback;
    return fallback;
  }, []);


  // カメラとMediaPipe Handsを初期化
  const initializeCamera = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const { Hands: HandsClass } = await import('@mediapipe/hands');
      const { Camera: CameraClass } = await import('@mediapipe/camera_utils');
      const assetBase = await resolveHandsAssetBase();

      const hands = new HandsClass({
        locateFile: (file: string) => {
          return `${assetBase}${file}`;
        }
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults((results: HandsResults) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          setHandLandmarks(landmarks);
          
          // Canvas描画（フレームレート最適化）
          if (ctx) {
            drawHandLandmarks(ctx, landmarks, canvas);
          }
          
          // 手形状認識（フレームレート最適化：30fps制限）
          const now = Date.now();
          const handsInstance = handsRef.current;
          if (!handsInstance) {
            return;
          }

          const lastProcessTime = handsInstance.lastProcessTime ?? 0;
          const shouldProcess = !handsInstance.lastProcessTime || now - lastProcessTime > 33;

          if (shouldProcess) {
            handsInstance.lastProcessTime = now;

            const result = recognizeHandShape(landmarks);
            if (result.confidence > 0.5) {
              // 完全な文字判定（濁音・半濁音・小書き文字を考慮）
              const completeLetter = getCompleteCharacter(result.letter, landmarks);
              setPrediction(fingerSpellingMap[completeLetter as FingerSpellingKey] || '');
              setConfidence(result.confidence);
            } else {
              setPrediction('');
              setConfidence(0);
            }
          }
        } else {
          setHandLandmarks(null);
          setPrediction('');
          setConfidence(0);
          // 手が検出されない場合はCanvasをクリア
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
      handsRef.current = hands;
      const video = videoRef.current;
      const camera = new CameraClass(video!, {
        onFrame: async () => {
          if (handsRef.current && video) {
            await handsRef.current.send({ image: video });
          }
        },
        width: 640,
        height: 480
      });
      cameraRef.current = camera;
      await camera.start();
      setIsActive(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Camera initialization error:', error);
      let errorMessage = 'カメラまたはMediaPipeの初期化に失敗しました。';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorDetails = error.message;
        
        if (error.message.includes('MediaPipe')) {
          errorMessage += ' インターネット接続を確認してください（MediaPipeのCDNへのアクセスが必要です）。';
        } else if (error.message.includes('camera') || error.message.includes('permission')) {
          errorMessage += ' カメラへのアクセスが拒否されました。';
        } else if (error.message.includes('NotAllowedError')) {
          errorMessage += ' カメラへのアクセスが拒否されました。ブラウザの設定でカメラを許可してください。';
        } else if (error.message.includes('NotFoundError')) {
          errorMessage += ' カメラが見つかりません。カメラが接続されているか確認してください。';
        } else if (error.message.includes('NotReadableError')) {
          errorMessage += ' カメラが他のアプリケーションで使用中です。他のアプリを閉じてください。';
        } else if (error.message.includes('OverconstrainedError')) {
          errorMessage += ' カメラの設定に問題があります。別のカメラを試してください。';
        } else {
          errorMessage += ` 詳細: ${errorDetails}`;
        }
      } else {
        errorMessage += ' 不明なエラーが発生しました。';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      // エラーをログに記録（本番環境では外部サービスに送信）
      if (process.env.NODE_ENV === 'production') {
        // 本番環境でのエラーログ送信（例：Sentry、LogRocket等）
        console.error('Production error:', {
          error: errorDetails,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
      }
    }
  }, [resolveHandsAssetBase]);

  // カメラ停止
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, [initializeCamera, stopCamera]);

  // キーボードアクセシビリティ
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Spaceキーでカメラの開始・停止
      if (event.code === 'Space' && !isLoading) {
        event.preventDefault();
        if (isActive) {
          stopCamera();
        } else {
          initializeCamera();
        }
      }
      // Escapeキーでカメラ停止
      if (event.code === 'Escape' && isActive) {
        stopCamera();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, isLoading, initializeCamera, stopCamera]);

  // --- UI展開 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">日本語指文字認識</h1>
          <p className="text-lg text-gray-600 mb-2">カメラに手をかざして指文字を認識してみましょう</p>
          <p className="text-sm text-gray-500">50音 + 濁音・半濁音に対応（最新の指文字データベース準拠）</p>
        </header>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" aria-live="assertive">
              <div className="font-bold mb-1">エラー: {error}</div>
              <ul className="mb-2 text-sm list-disc pl-5">
                <li>カメラのアクセス許可が拒否されている場合、ブラウザの設定でカメラを許可してください。</li>
                <li>他のアプリでカメラが使用中の場合は閉じてください。</li>
                <li>MediaPipeがサポートされていないブラウザの場合はChrome最新版を推奨します。</li>
              </ul>
              <button
                onClick={initializeCamera}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                aria-label="カメラ再試行"
                tabIndex={0}
              >
                再試行
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-80 object-cover" autoPlay playsInline muted />
                <canvas ref={canvasRef} width={640} height={480} className="absolute top-0 left-0 w-full h-full" />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-lg">読み込み中...</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={isActive ? stopCamera : initializeCamera}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={isActive ? 'カメラ停止' : 'カメラ開始'}
                  aria-describedby="camera-button-description"
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  {isActive ? 'カメラ停止' : 'カメラ開始'}
                </button>
                <div id="camera-button-description" className="sr-only">
                  カメラの開始・停止を制御します。Spaceキーでも操作できます。
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">認識結果</h3>
                <div 
                  className="bg-gray-50 rounded-lg p-8" 
                  aria-live="polite"
                  aria-label={`認識結果: ${prediction ? `${prediction}、信頼度${Math.round(confidence * 100)}パーセント` : '手をカメラに向けてください'}`}
                >
                  {prediction ? (
                    <>
                      <div 
                        className="text-6xl font-bold text-blue-600 mb-2"
                        role="img"
                        aria-label={`指文字: ${prediction}`}
                      >
                        {prediction}
                      </div>
                      <div className="text-sm text-gray-500">
                        信頼度: {Math.round(confidence * 100)}%
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl text-gray-400">
                      手をカメラに向けてください
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">認識可能な指文字（50音＋濁音・半濁音）</h4>
                <div className="grid grid-cols-10 gap-1 text-xs">
                  {(Object.values(fingerSpellingMap) as string[]).slice(0, 46).map((char, index) => (
                    <div
                      key={index}
                      className={`text-center p-2 rounded border ${prediction === char ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div>{char}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">特殊表現</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• 濁音（が、ざ、だ、ば行）：手を体の外側にずらす</div>
                  <div>• 半濁音（ぱ行）：手を上にずらす</div>
                  <div>• 小書き文字：手を体に近づける</div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">手の検出状態</h4>
                <div className="flex items-center gap-2 text-sm">
                  <div 
                    className={`w-3 h-3 rounded-full ${handLandmarks ? 'bg-green-500' : 'bg-red-500'}`}
                    role="img"
                    aria-label={handLandmarks ? '手を検出中' : '手が検出されません'}
                  ></div>
                  <span aria-live="polite">
                    {handLandmarks ? '手を検出中' : '手が検出されません'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">使い方</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Camera className="text-blue-500 mt-1" size={20} />
              <div>
                <div className="font-semibold">1. カメラ許可</div>
                <div>ブラウザでカメラアクセスを許可してください</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded mt-1"></div>
              <div>
                <div className="font-semibold">2. 手の位置</div>
                <div>カメラに手のひらを向けて指文字を作ってください</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded mt-1"></div>
              <div>
                <div className="font-semibold">3. 認識</div>
                <div>緑の点で手の関節が検出され、指文字が認識されます</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSLFingerSpelling;
