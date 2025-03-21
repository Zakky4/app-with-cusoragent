'use client';

import { useState } from 'react';
import Todo from './Todo';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = async () => {
    if (!newTodo.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
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

  return (
    <div className="space-y-6">
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
        {todos.map((todo, index) => (
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