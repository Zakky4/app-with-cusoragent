import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { completed } = await request.json();
  const id = parseInt(params.id);

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(todo);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  await prisma.todo.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
} 