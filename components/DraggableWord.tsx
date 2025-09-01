import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableWordProps {
  id: string;
  children: React.ReactNode;
}

const DraggableWord: React.FC<DraggableWordProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined;

  const draggingClasses = isDragging 
    ? 'opacity-90 scale-110 shadow-2xl shadow-yellow-500/60 bg-[#FFCC00] text-black ring-2 ring-yellow-400 border-transparent' 
    : 'hover:bg-[#FFCC00] hover:text-black hover:scale-105';

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-4 py-2 bg-[#4a4a4a] border border-gray-600 rounded-md text-white transition-all duration-200 cursor-grab active:cursor-grabbing ${draggingClasses}`}
    >
      {children}
    </button>
  );
};

export default DraggableWord;
