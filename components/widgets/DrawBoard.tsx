import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Trash2, PenTool } from 'lucide-react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const DrawBoard: React.FC<Props> = ({ data, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(data.color || '#000000');
  const [lineWidth, setLineWidth] = useState(data.lineWidth || 4);
  const [tool, setTool] = useState<'pen' | 'eraser'>(data.tool || 'pen');

  // We need to restore canvas state if we were to support full persistence,
  // but for a simple draggable widget, re-rendering clears it. 
  // To keep it simple, we just persist settings, not the full blob unless we want complex logic.
  // For this demo, we'll just keep the canvas alive while the component is mounted.
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set resolution
    if (canvas.width !== 600) {
        canvas.width = 600;
        canvas.height = 400;
        // Simple fill white
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Here we could save canvas dataURL to 'data' prop to persist across reloads
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded-lg">
        <button 
          onClick={() => setTool('pen')} 
          className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <PenTool size={20} />
        </button>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 cursor-pointer border-none bg-transparent"
        />
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={lineWidth} 
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-24"
        />
        <button 
          onClick={() => setTool('eraser')} 
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
        >
          <Eraser size={20} />
        </button>
        <div className="flex-grow"></div>
        <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-100 rounded">
            <Trash2 size={20} />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-gray-300 rounded shadow-sm cursor-crosshair bg-white touch-none"
        style={{ width: '100%', height: '300px' }} // CSS size
      />
    </div>
  );
};