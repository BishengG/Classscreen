
import React, { useState, useEffect, useRef } from 'react';
import { X, GripHorizontal, ArrowDownRight } from 'lucide-react';
import { WidgetInstance } from '../types';

interface DraggableWidgetProps {
  widget: WidgetInstance;
  title: string;
  onClose: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WidgetInstance>) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  title,
  onClose,
  onUpdate,
  onFocus,
  children,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // --- Dragging Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); 
    onFocus(widget.id);
    setIsDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // --- Resizing Logic ---
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start
    e.preventDefault();
    onFocus(widget.id);
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Simple bounds checking
        const clampedX = Math.max(0, Math.min(window.innerWidth - 50, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - 50, newY));

        onUpdate(widget.id, {
          position: { x: clampedX, y: clampedY }
        });
      }

      if (isResizing) {
        const rect = nodeRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        // Calculate new width/height based on mouse position relative to widget top-left
        // Note: We use widget.position because we are absolute positioned
        const newWidth = Math.max(200, e.clientX - widget.position.x);
        const newHeight = Math.max(150, e.clientY - widget.position.y);

        onUpdate(widget.id, {
            width: newWidth,
            height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, widget.id, widget.position, onUpdate]);

  return (
    <div
      ref={nodeRef}
      className={`absolute flex flex-col bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-shadow duration-200 ${className}`}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.width,
        height: widget.height,
        zIndex: widget.zIndex,
        boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : undefined
      }}
      onMouseDown={() => onFocus(widget.id)}
    >
      {/* Header Bar */}
      <div
        className="h-10 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-3 cursor-move select-none flex-shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-gray-500">
          <GripHorizontal size={16} />
          <span className="font-semibold text-sm truncate max-w-[150px]">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(widget.id); }}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 custom-scrollbar overflow-auto relative">
        {children}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-gray-400 hover:text-blue-500"
        onMouseDown={handleResizeStart}
      >
        <ArrowDownRight size={20} />
      </div>
    </div>
  );
};
