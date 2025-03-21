import { PrismaClient } from '@prisma/client';
import TodoList from './components/TodoList';

const prisma = new PrismaClient();

export default async function Home() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todoリスト</h1>
        <TodoList initialTodos={todos} />
      </div>
    </main>
  );
}
