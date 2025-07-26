import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Play, Pause } from 'lucide-react';
import { fingerSpellingMap } from '../fingerSpellingMap';
import { recognizeHandShape } from '../utils/handRecognition';
import { drawHandLandmarks } from '../utils/canvasDrawing';
import type { Hands, HandsResults, Landmark } from '@mediapipe/hands';
import type { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';

type FingerSpellingKey = keyof typeof fingerSpellingMap;

const JSLFingerSpelling = () => {
  console.log("[DEBUG] JSLFingerSpellingコンポーネント初期化");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [handLandmarks, setHandLandmarks] = useState<Landmark[] | null>(null);
  const [error, setError] = useState('');
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);


  // カメラとMediaPipe Handsを初期化
  const initializeCamera = useCallback(async () => {
    console.log("[DEBUG] initializeCamera開始");
    try {
      setError('');
      setIsLoading(true);
      const { Hands: HandsClass } = await import('@mediapipe/hands');
      const { Camera: CameraClass } = await import('@mediapipe/camera_utils');
      const hands = new HandsClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          setHandLandmarks(landmarks);
          
          // Canvas描画
          if (ctx) {
            drawHandLandmarks(ctx, landmarks, canvas);
          }
          
          // 手形状認識
          const result = recognizeHandShape(landmarks);
          if (result.confidence > 0.5) {
            setPrediction(fingerSpellingMap[result.letter as FingerSpellingKey] || '');
            setConfidence(result.confidence);
          } else {
            setPrediction('');
            setConfidence(0);
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
      
      if (error instanceof Error) {
        if (error.message.includes('MediaPipe')) {
          errorMessage += ' インターネット接続を確認してください（MediaPipeのCDNへのアクセスが必要です）。';
        } else if (error.message.includes('camera') || error.message.includes('permission')) {
          errorMessage += ' カメラへのアクセスが拒否されました。';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  // カメラ停止
  const stopCamera = useCallback(() => {
    console.log("[DEBUG] stopCamera呼び出し");
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
    console.log("[DEBUG] useEffect実行");
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, [initializeCamera, stopCamera]);

  // --- UI展開 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">日本語指文字認識</h1>
          <p className="text-lg text-gray-600">カメラに手をかざして指文字を認識してみましょう</p>
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  aria-label={isActive ? 'カメラ停止' : 'カメラ開始'}
                  tabIndex={0}
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  {isActive ? 'カメラ停止' : 'カメラ開始'}
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">認識結果</h3>
                <div className="bg-gray-50 rounded-lg p-8" aria-live="polite">
                  {prediction ? (
                    <>
                      <div className="text-6xl font-bold text-blue-600 mb-2">{prediction}</div>
                      <div className="text-sm text-gray-500">信頼度: {Math.round(confidence * 100)}%</div>
                    </>
                  ) : (
                    <div className="text-2xl text-gray-400">手をカメラに向けてください</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">認識可能な指文字</h4>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.values(fingerSpellingMap) as string[]).slice(0, 5).map((char, index) => (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg border-2 ${prediction === char ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="text-2xl font-bold">{char}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">手の検出状態</h4>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${handLandmarks ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{handLandmarks ? '手を検出中' : '手が検出されません'}</span>
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
