'use client';

import { useState } from 'react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TodoProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Todo({ id, title, completed, onToggle, onDelete }: TodoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center justify-between p-4 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ${
        completed
          ? 'bg-green-500/20 border-2 border-green-500/30'
          : 'bg-white/20 border-2 border-white/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggle(id)}
          className={`w-6 h-6 transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          } ${completed ? 'text-green-400' : 'text-white/70'}`}
        >
          <CheckCircleIcon className={`transition-all duration-300 ${
            completed ? 'stroke-2' : 'stroke-1'
          }`} />
        </button>
        <span
          className={`text-lg transition-all duration-300 ${
            completed
              ? 'line-through text-white/50'
              : 'text-white'
          }`}
        >
          {title}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        className={`text-white/70 hover:text-red-400 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
        }`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 