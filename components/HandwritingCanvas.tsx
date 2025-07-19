import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

interface HandwritingCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onStrokeComplete?: (stroke: Stroke) => void;
  onCanvasChange?: (imageData: string) => void;
  disabled?: boolean;
  showToolbar?: boolean;
  backgroundImage?: string; // 問題画像などを背景として表示
}

const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onStrokeComplete,
  onCanvasChange,
  disabled = false,
  showToolbar = true,
  backgroundImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentTool, setCurrentTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  // Canvas初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    
    if (!canvas || !backgroundCanvas) return;

    // メインキャンバス設定
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalAlpha = 1;
    contextRef.current = context;

    // 背景キャンバス設定
    backgroundCanvas.width = width;
    backgroundCanvas.height = height;
    const backgroundContext = backgroundCanvas.getContext('2d');
    if (!backgroundContext) return;

    // 背景色設定
    backgroundContext.fillStyle = backgroundColor;
    backgroundContext.fillRect(0, 0, width, height);

    // 背景画像の描画
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        // 画像をキャンバスサイズに合わせて描画
        const scale = Math.min(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        backgroundContext.drawImage(img, x, y, scaledWidth, scaledHeight);
      };
      img.src = backgroundImage;
    }
  }, [width, height, backgroundColor, backgroundImage]);

  // 描画設定の更新
  useEffect(() => {
    const context = contextRef.current;
    if (!context) return;

    switch (currentTool) {
      case 'pen':
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 1;
        context.strokeStyle = currentColor;
        context.lineWidth = currentWidth;
        break;
      case 'highlighter':
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 0.3;
        context.strokeStyle = currentColor;
        context.lineWidth = currentWidth * 3;
        break;
      case 'eraser':
        context.globalCompositeOperation = 'destination-out';
        context.globalAlpha = 1;
        context.lineWidth = currentWidth * 2;
        break;
    }
  }, [currentTool, currentColor, currentWidth]);

  // 座標取得（マウス・タッチ対応）
  const getPointFromEvent = useCallback((event: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number, pressure = 1;

    if ('touches' in event) {
      // タッチイベント
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      // @ts-ignore: Pressure is experimental
      pressure = touch.force || 1;
    } else {
      // マウスイベント
      clientX = event.clientX;
      clientY = event.clientY;
      // @ts-ignore: Pressure is experimental
      pressure = event.pressure || 1;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      pressure,
      timestamp: Date.now()
    };
  }, []);

  // 描画開始
  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    event.preventDefault();
    const point = getPointFromEvent(event);
    
    const newStroke: Stroke = {
      id: `stroke_${Date.now()}_${Math.random()}`,
      points: [point],
      color: currentColor,
      width: currentWidth,
      tool: currentTool
    };

    setCurrentStroke(newStroke);
    setIsDrawing(true);

    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(point.x, point.y);
  }, [disabled, getPointFromEvent, currentColor, currentWidth, currentTool]);

  // 描画中
  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke || disabled) return;

    event.preventDefault();
    const point = getPointFromEvent(event);
    const context = contextRef.current;
    if (!context) return;

    // ストロークに点を追加
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    };
    setCurrentStroke(updatedStroke);

    // 筆圧対応の線幅調整
    const pressureWidth = currentWidth * (point.pressure || 1);
    context.lineWidth = pressureWidth;

    // 線を描画
    context.lineTo(point.x, point.y);
    context.stroke();
  }, [isDrawing, currentStroke, disabled, getPointFromEvent, currentWidth]);

  // 描画終了
  const endDrawing = useCallback(() => {
    if (!isDrawing || !currentStroke) return;

    setIsDrawing(false);

    // Undo/Redoスタック更新
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setCanUndo(true);
    setCanRedo(false);

    // ストローク追加
    const newStrokes = [...strokes, currentStroke];
    setStrokes(newStrokes);

    // コールバック実行
    if (onStrokeComplete) {
      onStrokeComplete(currentStroke);
    }

    if (onCanvasChange) {
      // 少し遅延させてから画像データを取得
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const imageData = canvas.toDataURL('image/png');
          onCanvasChange(imageData);
        }
      }, 100);
    }

    setCurrentStroke(null);
  }, [isDrawing, currentStroke, strokes, onStrokeComplete, onCanvasChange]);

  // Undo機能
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousStrokes = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [...redoStack, strokes];

    setStrokes(previousStrokes);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    setCanUndo(newUndoStack.length > 0);
    setCanRedo(true);

    redrawCanvas(previousStrokes);
  }, [undoStack, redoStack, strokes]);

  // Redo機能
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextStrokes = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const newUndoStack = [...undoStack, strokes];

    setStrokes(nextStrokes);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
    setCanUndo(true);
    setCanRedo(newRedoStack.length > 0);

    redrawCanvas(nextStrokes);
  }, [redoStack, undoStack, strokes]);

  // キャンバス再描画
  const redrawCanvas = useCallback((strokesToRedraw: Stroke[]) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // キャンバスクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 全ストロークを再描画
    strokesToRedraw.forEach(stroke => {
      if (stroke.points.length === 0) return;

      // ツール設定を適用
      switch (stroke.tool) {
        case 'pen':
          context.globalCompositeOperation = 'source-over';
          context.globalAlpha = 1;
          break;
        case 'highlighter':
          context.globalCompositeOperation = 'source-over';
          context.globalAlpha = 0.3;
          break;
        case 'eraser':
          context.globalCompositeOperation = 'destination-out';
          context.globalAlpha = 1;
          break;
      }

      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.width;

      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y);

      stroke.points.forEach(point => {
        context.lineTo(point.x, point.y);
      });

      context.stroke();
    });
  }, []);

  // 全消去
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Undo stackに現在の状態を追加
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setCanUndo(true);
    setCanRedo(false);

    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);

    if (onCanvasChange) {
      const imageData = canvas.toDataURL('image/png');
      onCanvasChange(imageData);
    }
  }, [strokes, onCanvasChange]);

  // 画像として保存
  const saveAsImage = useCallback(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!canvas || !backgroundCanvas) return;

    // 合成用の新しいキャンバスを作成
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = width;
    compositeCanvas.height = height;
    const compositeContext = compositeCanvas.getContext('2d');
    if (!compositeContext) return;

    // 背景を描画
    compositeContext.drawImage(backgroundCanvas, 0, 0);
    
    // 手書きを描画
    compositeContext.drawImage(canvas, 0, 0);

    // ダウンロード
    const link = document.createElement('a');
    link.download = `handwriting_${new Date().getTime()}.png`;
    link.href = compositeCanvas.toDataURL('image/png');
    link.click();
  }, [width, height]);

  return (
    <div className="flex flex-col space-y-4">
      {/* ツールバー */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          {/* ツール選択 */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentTool('pen')}
              className={`p-2 rounded ${currentTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              title="ペン"
            >
              ✏️
            </button>
            <button
              onClick={() => setCurrentTool('highlighter')}
              className={`p-2 rounded ${currentTool === 'highlighter' ? 'bg-yellow-500 text-white' : 'bg-white'}`}
              title="ハイライター"
            >
              🖍️
            </button>
            <button
              onClick={() => setCurrentTool('eraser')}
              className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-red-500 text-white' : 'bg-white'}`}
              title="消しゴム"
            >
              🧽
            </button>
          </div>

          {/* 色選択 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">色:</span>
            <div className="flex space-x-1">
              {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'].map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-6 h-6 rounded border-2 ${currentColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                  title={`色: ${color}`}
                />
              ))}
            </div>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 rounded border"
            />
          </div>

          {/* 線幅 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">太さ:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={currentWidth}
              onChange={(e) => setCurrentWidth(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-8">{currentWidth}px</span>
          </div>

          {/* アクション */}
          <div className="flex space-x-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="元に戻す"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="やり直し"
            >
              ↷
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              title="全消去"
            >
              🗑️
            </button>
            <button
              onClick={saveAsImage}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              title="画像として保存"
            >
              💾
            </button>
          </div>
        </div>
      )}

      {/* キャンバス領域 */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        {/* 背景キャンバス */}
        <canvas
          ref={backgroundCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
        
        {/* 描画キャンバス */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className={`block ${disabled ? 'pointer-events-none' : 'cursor-crosshair'}`}
          style={{ zIndex: 2, touchAction: 'none' }}
        />

        {/* 描画中のフィードバック */}
        {isDrawing && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm z-10">
            描画中...
          </div>
        )}
      </div>

      {/* 使用方法ヒント */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium mb-1">💡 使い方のヒント:</h4>
        <ul className="space-y-1 text-xs">
          <li>• ペンで図形に書き込んだり、計算過程を記録できます</li>
          <li>• ハイライターで重要な部分をマークしましょう</li>
          <li>• 間違えたら消しゴムで修正できます</li>
          <li>• スマートフォンやタブレットでは指やスタイラスが使えます</li>
        </ul>
      </div>
    </div>
  );
};

export default HandwritingCanvas;