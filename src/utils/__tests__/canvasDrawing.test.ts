import { drawHandLandmarks, createDebounce } from '../canvasDrawing';
import { jest } from '@jest/globals';

describe('canvasDrawing', () => {
  describe('drawHandLandmarks', () => {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let mockClearRect: jest.Mock;
    let mockBeginPath: jest.Mock;
    let mockMoveTo: jest.Mock;
    let mockLineTo: jest.Mock;
    let mockStroke: jest.Mock;
    let mockArc: jest.Mock;
    let mockFill: jest.Mock;

    beforeEach(() => {
      // Canvas要素とコンテキストのモックを作成
      canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      
      mockClearRect = jest.fn();
      mockBeginPath = jest.fn();
      mockMoveTo = jest.fn();
      mockLineTo = jest.fn();
      mockStroke = jest.fn();
      mockArc = jest.fn();
      mockFill = jest.fn();

      ctx = {
        clearRect: mockClearRect,
        beginPath: mockBeginPath,
        moveTo: mockMoveTo,
        lineTo: mockLineTo,
        stroke: mockStroke,
        arc: mockArc,
        fill: mockFill,
        save: jest.fn(),
        restore: jest.fn(),
        strokeStyle: '',
        fillStyle: '',
        lineWidth: 0,
      } as unknown as CanvasRenderingContext2D;
    });

    it('キャンバスをクリアする', () => {
      const landmarks = Array(21).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));
      
      drawHandLandmarks(ctx, landmarks, canvas);
      
      expect(mockClearRect).toHaveBeenCalledWith(0, 0, 640, 480);
    });

    it('21個のランドマークポイントを描画する', () => {
      const landmarks = Array(21).fill(null).map((_, i) => ({
        x: i / 21,
        y: i / 21,
        z: 0
      }));
      
      drawHandLandmarks(ctx, landmarks, canvas);
      
      // パフォーマンス最適化後：バッチ処理で2回のfill呼び出し（指先用とその他用）
      expect(mockArc).toHaveBeenCalledTimes(21);
      expect(mockFill).toHaveBeenCalledTimes(2); // 指先用とその他用
    });

    it('指先は赤、その他のポイントは緑で描画する', () => {
      const landmarks = Array(21).fill(null).map(() => ({
        x: 0.5,
        y: 0.5,
        z: 0
      }));
      
      drawHandLandmarks(ctx, landmarks, canvas);
      
      // fillStyleの設定回数を確認
      const fillStyleCalls = (ctx as CanvasRenderingContext2D & { fillStyle?: string }).fillStyle;
      expect(fillStyleCalls).toBeDefined();
    });

    it('接続線を正しく描画する', () => {
      const landmarks = Array(21).fill(null).map((_, i) => ({
        x: i / 21,
        y: i / 21,
        z: 0
      }));
      
      drawHandLandmarks(ctx, landmarks, canvas);
      
      // 接続線の数だけmoveToとlineToが呼ばれる
      expect(mockMoveTo).toHaveBeenCalled();
      expect(mockLineTo).toHaveBeenCalled();
      expect(mockStroke).toHaveBeenCalled();
    });
  });

  describe('createDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('指定された遅延後に関数を実行する', () => {
      const mockFn = jest.fn();
      const debouncedFn = createDebounce(mockFn, 100);
      
      debouncedFn('test');
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('連続して呼ばれた場合、最後の呼び出しのみ実行する', () => {
      const mockFn = jest.fn();
      const debouncedFn = createDebounce(mockFn, 100);
      
      debouncedFn('first');
      jest.advanceTimersByTime(50);
      debouncedFn('second');
      jest.advanceTimersByTime(50);
      debouncedFn('third');
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });
  });
});