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
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            ✨ Todoリスト ✨
          </h1>
          <TodoList initialTodos={todos} />
        </div>
      </div>
    </main>
  );
}
