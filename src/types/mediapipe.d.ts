// MediaPipe Hands 型定義
declare module '@mediapipe/hands' {
  export interface HandsConfig {
    locateFile: (file: string) => string;
  }

  export interface HandsOptions {
    maxNumHands?: number;
    modelComplexity?: 0 | 1;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }

  export interface Landmark {
    x: number;
    y: number;
    z: number;
  }

  export interface HandsResults {
    multiHandLandmarks?: Landmark[][];
    multiHandWorldLandmarks?: Landmark[][];
    multiHandedness?: Array<{
      index: number;
      score: number;
      label: string;
    }>;
  }

  export class Hands {
    constructor(config: HandsConfig);
    setOptions(options: HandsOptions): void;
    onResults(callback: (results: HandsResults) => void): void;
    send(inputs: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }): Promise<void>;
    close(): void;
  }
}

// MediaPipe Camera Utils 型定義
declare module '@mediapipe/camera_utils' {
  export interface CameraConfig {
    onFrame: () => Promise<void>;
    width?: number;
    height?: number;
    facingMode?: 'user' | 'environment';
  }

  export class Camera {
    constructor(videoElement: HTMLVideoElement, config: CameraConfig);
    start(): Promise<void>;
    stop(): void;
  }
}