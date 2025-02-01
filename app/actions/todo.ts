"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function AddTodo({ title }: { title: string; userId: string }) {
  try {
    const { userId } = await auth();

    if (!userId) return { error: "Not Authenticated" };

    await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });

    return { success: "Data added successfully" };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function GetTodo() {
  try {
    const { userId } = await auth();

    if (!userId) return { error: "Not Authenticated" };

    const todo = await prisma.todo.findMany({
      where: {
        userId,
      },
      // order by created_at in descending order
      orderBy: {
        createdAt: "desc",
      },
    });

    return { todo };
  } catch (error) {
    console.log(error);
    return { error: "Something went Mauvais" };
  }
}

export async function ToggleTodo({ id }: { id: number }) {
  try {
    const { userId } = await auth();

    if (!userId) return { error: "Not Authenticated" };

    // check if the user is the owner of the todo item

    const isTheOwner = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!isTheOwner) return { error: "Not Authenticated" };

    await prisma.todo.update({
      data: {
        done: !isTheOwner.done,
      },
      where: {
        id,
        userId,
      },
    });

    return { success: "Todo Toggled successfully" };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function DeleteTodo({ id }: { id: number }) {
  try {
    const { userId } = await auth();

    if (!userId) return { error: "Not Authenticated" };

    // check if the user is the owner of the todo item

    const isTheOwner = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!isTheOwner) return { error: "Not Authenticated" };

    await prisma.todo.delete({
      where: {
        id,
        userId,
      },
    });

    return { success: "Todo deleted successfully" };
  } catch {
    return { error: "Something went wrong" };
  }
}