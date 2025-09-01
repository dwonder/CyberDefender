import React from 'react';
import { useDroppable } from '@dnd-kit/core';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

interface DroppableBlankProps {
  droppedWord: string | null;
  status: AnswerStatus;
}

const DroppableBlank: React.FC<DroppableBlankProps> = ({ droppedWord, status }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-blank',
  });

  const baseClasses = "inline-block text-center mx-2 px-4 py-2 rounded-md transition-all duration-300 min-w-[200px] align-middle font-bold";
  
  let statusClasses = 'border-2 border-dashed border-gray-400 bg-gray-700 bg-opacity-50';
  if (isOver) {
    statusClasses = 'border-2 border-solid border-yellow-400 bg-yellow-900 bg-opacity-70 scale-105 text-[#FFCC00]';
  } else if (status === 'correct') {
    statusClasses = 'border-2 border-solid border-green-500 bg-green-900 bg-opacity-70 text-green-300';
  } else if (status === 'incorrect') {
    statusClasses = 'border-2 border-solid border-[#D40511] bg-red-900 bg-opacity-70 text-red-300 animate-shake';
  }

  return (
    <span
      ref={setNodeRef}
      className={`${baseClasses} ${statusClasses}`}
    >
      {droppedWord || '...'}
    </span>
  );
};

export default DroppableBlank;
