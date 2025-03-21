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
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggle(id)}
          className={`w-6 h-6 ${
            completed ? 'text-green-500' : 'text-gray-300'
          }`}
        >
          <CheckCircleIcon />
        </button>
        <span className={`${completed ? 'line-through text-gray-500' : ''}`}>
          {title}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 