'use client';

import { useState, useMemo } from 'react';
import Todo from './Todo';
import { PlusIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  dueDate?: Date;
}

interface TodoListProps {
  initialTodos: Todo[];
}

const CATEGORIES = ['未分類', '仕事', '個人', '買い物', '勉強'];

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
        const matchesCompleted = showCompleted || !todo.completed;
        return matchesSearch && matchesCategory && matchesCompleted;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.getTime() - b.dueDate.getTime();
          case 'priority':
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          default:
            return 0;
        }
      });
  }, [todos, searchQuery, selectedCategory, sortBy, showCompleted]);

  const addTodo = async () => {
    if (!newTodo.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          category: selectedCategory === 'all' ? '未分類' : selectedCategory,
        }),
      });

      const todo = await response.json();
      setTodos([todo, ...todos]);
      setNewTodo('');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    if (response.ok) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTodos(todos.filter((t) => t.id !== id));
    }
  };

  const updatePriority = async (id: number, priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    const response = await fetch(`/api/todos/${id}/priority`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priority }),
    });

    if (response.ok) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, priority } : t
        )
      );
    }
  };

  const updateDueDate = async (id: number, dueDate?: Date) => {
    const response = await fetch(`/api/todos/${id}/dueDate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dueDate }),
    });

    if (response.ok) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, dueDate } : t
        )
      );
    }
  };

  const updateCategory = async (id: number, category: string) => {
    const response = await fetch(`/api/todos/${id}/category`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (response.ok) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, category } : t
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タスクを検索..."
            className="w-full p-3 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex space-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300">
              <FunnelIcon className="w-5 h-5" />
            </Menu.Button>
            <Menu.Items className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2`}
                    onClick={() => setShowCompleted(!showCompleted)}
                  >
                    {showCompleted ? '完了済みを非表示' : '完了済みを表示'}
                  </button>
                )}
              </Menu.Item>
              {CATEGORIES.map(category => (
                <Menu.Item key={category}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } w-full text-left px-4 py-2`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
          <Menu as="div" className="relative">
            <Menu.Button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300">
              <ArrowsUpDownIcon className="w-5 h-5" />
            </Menu.Button>
            <Menu.Items className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
              {[
                { key: 'dueDate', label: '期限日' },
                { key: 'priority', label: '優先度' },
                { key: 'createdAt', label: '作成日' },
              ].map(({ key, label }) => (
                <Menu.Item key={key}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } w-full text-left px-4 py-2`}
                      onClick={() => setSortBy(key as any)}
                    >
                      {label}順
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="新しいタスクを入力..."
          className="w-full p-4 pr-16 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
        />
        <button
          onClick={addTodo}
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-3">
        {filteredTodos.map((todo, index) => (
          <div
            key={todo.id}
            className="transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              opacity: 0,
              animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
            }}
          >
            <Todo
              {...todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdatePriority={updatePriority}
              onUpdateDueDate={updateDueDate}
              onUpdateCategory={updateCategory}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 