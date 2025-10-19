import React, { useState, useEffect, useRef } from 'react';
import { TextElement } from '../types';

interface DraggableTextProps {
  element: TextElement;
  canvasRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextElement>) => void;
}

const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

const getHandleStyles = (handle: string): React.CSSProperties => {
    const style: React.CSSProperties = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'white',
        border: '2px solid #6336E4',
        borderRadius: '50%',
        zIndex: 11,
    };
    switch (handle) {
        case 'nw': return { ...style, top: '-5px', left: '-5px', cursor: 'nwse-resize' };
        case 'n':  return { ...style, top: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' };
        case 'ne': return { ...style, top: '-5px', right: '-5px', cursor: 'nesw-resize' };
        case 'w':  return { ...style, top: '50%', left: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize' };
        case 'e':  return { ...style, top: '50%', right: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize' };
        case 'sw': return { ...style, bottom: '-5px', left: '-5px', cursor: 'nesw-resize' };
        case 's':  return { ...style, bottom: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' };
        case 'se': return { ...style, bottom: '-5px', right: '-5px', cursor: 'nwse-resize' };
        default: return {};
    }
};


const DraggableText: React.FC<DraggableTextProps> = ({ element, canvasRef, isSelected, onSelect, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState('');

  const textRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartRect = useRef({ x: 0, y: 0, width: 0, height: 0, fontSize: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    if (textRef.current) {
        elementStartPos.current = { x: textRef.current.offsetLeft, y: textRef.current.offsetTop };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsResizing(true);
    setResizeHandle(handle);
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    if (canvasRef.current && textRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const textRect = textRef.current.getBoundingClientRect();
        elementStartRect.current = {
            x: textRect.left - canvasRect.left,
            y: textRect.top - canvasRect.top,
            width: textRect.width,
            height: textRect.height,
            fontSize: element.fontSize,
        };
    }
  };


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || (!isDragging && !isResizing)) return;
      e.preventDefault();

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      if (isDragging) {
        const newLeft = elementStartPos.current.x + dx;
        const newTop = elementStartPos.current.y + dy;
        
        onUpdate({
          x: (newLeft / canvasRect.width) * 100,
          y: (newTop / canvasRect.height) * 100,
        });
      }

      if (isResizing) {
        const { x, y, width, height, fontSize } = elementStartRect.current;
        let newX = x, newY = y, newWidth = width, newHeight = height;

        if (resizeHandle.includes('e')) { newWidth = width + dx; }
        if (resizeHandle.includes('w')) { newWidth = width - dx; newX = x + dx; }
        if (resizeHandle.includes('s')) { newHeight = height + dy; }
        if (resizeHandle.includes('n')) { newHeight = height - dy; newY = y + dy; }

        const updates: Partial<TextElement> = {};
        
        if (newWidth < 20) {
            if (resizeHandle.includes('w')) newX = newX + newWidth - 20;
            newWidth = 20;
        }
        if (newHeight < 15) {
            if (resizeHandle.includes('n')) newY = newY + newHeight - 15;
            newHeight = 15;
        }
        
        updates.x = (newX / canvasRect.width) * 100;
        updates.y = (newY / canvasRect.height) * 100;
        updates.width = (newWidth / canvasRect.width) * 100;
        updates.height = (newHeight / canvasRect.height) * 100;

        const heightRatio = newHeight / height;
        if (height > 0 && Math.abs(heightRatio - 1) > 0.01) {
            updates.fontSize = Math.max(8, fontSize * heightRatio);
        }

        onUpdate(updates);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, onUpdate, canvasRef]);


  const handleTextChange = (e: React.FocusEvent<HTMLDivElement>) => {
    onUpdate({ text: e.currentTarget.textContent || '' });
  };
  
  return (
    <div
      ref={textRef}
      onMouseDown={handleDragMouseDown}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        color: element.color,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textAlign: element.textAlign,
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: isSelected ? '2px dashed #6336E4' : 'none',
        zIndex: element.zIndex,
      }}
      className="p-1"
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTextChange}
        className="w-full h-full focus:outline-none"
        style={{ minHeight: `${element.fontSize}px`}}
        dangerouslySetInnerHTML={{ __html: element.text }}
      />
      {isSelected && (
        <>
            {handles.map(handle => (
                <div
                    key={handle}
                    className="resize-handle"
                    style={getHandleStyles(handle)}
                    onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                />
            ))}
        </>
      )}
    </div>
  );
};

export default DraggableText;