'use client';

import { useState } from 'react';
import { CheckCircleIcon, TrashIcon, CalendarIcon, FlagIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

interface TodoProps {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  dueDate?: Date;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdatePriority: (id: number, priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  onUpdateDueDate: (id: number, dueDate?: Date) => void;
  onUpdateCategory: (id: number, category: string) => void;
}

const PRIORITY_COLORS = {
  LOW: 'text-blue-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-red-400',
};

const CATEGORIES = ['未分類', '仕事', '個人', '買い物', '勉強'];

export default function Todo({
  id,
  title,
  description,
  completed,
  priority,
  category,
  dueDate,
  onToggle,
  onDelete,
  onUpdatePriority,
  onUpdateDueDate,
  onUpdateCategory,
}: TodoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
      <div className="flex-1 flex items-center space-x-4">
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
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg transition-all duration-300 ${
                completed
                  ? 'line-through text-white/50'
                  : 'text-white'
              }`}
            >
              {title}
            </span>
            <span className={`text-sm ${PRIORITY_COLORS[priority]}`}>
              {priority === 'HIGH' ? '🔴' : priority === 'MEDIUM' ? '🟡' : '🔵'}
            </span>
            <span className="text-sm text-white/70">
              {category}
            </span>
          </div>
          {description && (
            <p className="text-sm text-white/60 mt-1">{description}</p>
          )}
          {dueDate && (
            <p className="text-sm text-white/70 mt-1">
              期限: {format(new Date(dueDate), 'yyyy/MM/dd', { locale: ja })}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-white/70 hover:text-white transition-all duration-300">
            <FlagIcon className="w-5 h-5" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
            {(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
              <Menu.Item key={p}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 flex items-center space-x-2`}
                    onClick={() => onUpdatePriority(id, p)}
                  >
                    <span className={PRIORITY_COLORS[p]}>
                      {p === 'HIGH' ? '🔴' : p === 'MEDIUM' ? '🟡' : '🔵'}
                    </span>
                    <span>{p === 'HIGH' ? '高' : p === 'MEDIUM' ? '中' : '低'}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-white/70 hover:text-white transition-all duration-300">
            📁
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
            {CATEGORIES.map((c) => (
              <Menu.Item key={c}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2`}
                    onClick={() => onUpdateCategory(id, c)}
                  >
                    {c}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="p-2 text-white/70 hover:text-white transition-all duration-300"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          {isDatePickerOpen && (
            <div className="absolute right-0 z-10">
              <DatePicker
                selected={dueDate ? new Date(dueDate) : null}
                onChange={(date) => {
                  onUpdateDueDate(id, date || undefined);
                  setIsDatePickerOpen(false);
                }}
                locale={ja}
                dateFormat="yyyy/MM/dd"
                isClearable
                inline
              />
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(id)}
          className={`p-2 text-white/70 hover:text-red-400 transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
          }`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 