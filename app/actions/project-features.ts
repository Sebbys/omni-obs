"use server"

import { db } from "@/db"
import { projectTodos, projectChangelogs } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// --- Project Todos Actions ---

export async function getProjectTodos(projectId: string) {
  try {
    const todos = await db.query.projectTodos.findMany({
      where: eq(projectTodos.projectId, projectId),
      orderBy: [desc(projectTodos.createdAt)],
    });
    return todos;
  } catch (error) {
    console.error("Failed to fetch project todos:", error);
    throw new Error("Failed to fetch project todos");
  }
}

export async function createProjectTodo(projectId: string, content: string) {
  try {
    const [newTodo] = await db.insert(projectTodos).values({
      projectId,
      content,
      completed: false, // Default to not completed
    }).returning();

    revalidatePath("/projects");
    return newTodo;
  } catch (error) {
    console.error("Failed to create project todo:", error);
    throw new Error("Failed to create project todo");
  }
}

export async function toggleProjectTodo(todoId: string) {
  try {
    const [existingTodo] = await db.query.projectTodos.findMany({
      where: eq(projectTodos.id, todoId)
    });

    if (!existingTodo) {
      throw new Error("Todo not found");
    }

    const [updatedTodo] = await db.update(projectTodos)
      .set({
        completed: !existingTodo.completed,
      })
      .where(eq(projectTodos.id, todoId))
      .returning();

    revalidatePath("/projects");
    return updatedTodo;
  } catch (error) {
    console.error("Failed to toggle project todo status:", error);
    throw new Error("Failed to toggle project todo status");
  }
}

export async function deleteProjectTodo(todoId: string, projectId: string) {
  try {
    await db.delete(projectTodos).where(eq(projectTodos.id, todoId));
    revalidatePath("/projects");
  } catch (error) {
    console.error("Failed to delete project todo:", error);
    throw new Error("Failed to delete project todo");
  }
}

// --- Project Changelogs Actions ---

export async function getProjectChangelogs(projectId: string) {
  try {
    const changelogs = await db.query.projectChangelogs.findMany({
      where: eq(projectChangelogs.projectId, projectId),
      orderBy: [desc(projectChangelogs.date)],
    });
    return changelogs;
  } catch (error) {
    console.error("Failed to fetch project changelogs:", error);
    throw new Error("Failed to fetch project changelogs");
  }
}

export async function createProjectChangelog(projectId: string, data: { version: string; title: string; content: string; date?: Date }) {
  try {
    const [newChangelog] = await db.insert(projectChangelogs).values({
      projectId,
      version: data.version,
      title: data.title,
      content: data.content,
      date: data.date || new Date(),
    }).returning();

    revalidatePath("/projects");
    return newChangelog;
  } catch (error) {
    console.error("Failed to create project changelog:", error);
    throw new Error("Failed to create project changelog");
  }
}

export async function deleteProjectChangelog(changelogId: string, projectId: string) {
  try {
    await db.delete(projectChangelogs).where(eq(projectChangelogs.id, changelogId));
    revalidatePath("/projects");
  } catch (error) {
    console.error("Failed to delete project changelog:", error);
    throw new Error("Failed to delete project changelog");
  }
}
