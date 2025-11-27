"use server"

import { db } from "@/db"
import { projectTodos } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getProjectTodos(projectId: string) {
    try {
        const todos = await db.query.projectTodos.findMany({
            where: eq(projectTodos.projectId, projectId),
            orderBy: [desc(projectTodos.createdAt)],
        })
        return todos.map(todo => ({
            ...todo,
            createdAt: todo.createdAt.toISOString(),
        }))
    } catch (error) {
        console.error("Failed to fetch project todos:", error)
        throw new Error("Failed to fetch project todos")
    }
}

export async function createTodo(
    projectId: string,
    content: string,
    category: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other" = "other",
    priority: "low" | "medium" | "high" = "medium"
) {
    try {
        const [newTodo] = await db.insert(projectTodos).values({
            projectId,
            content,
            category,
            priority,
            status: "todo",
        }).returning()

        revalidatePath(`/projects/${projectId}`)
        return {
            ...newTodo,
            createdAt: newTodo.createdAt.toISOString(),
        }
    } catch (error) {
        console.error("Failed to create todo:", error)
        throw new Error("Failed to create todo")
    }
}

export async function updateTodo(
    id: string,
    updates: {
        completed?: boolean
        status?: "todo" | "in_progress" | "review" | "done"
        category?: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other"
        priority?: "low" | "medium" | "high"
    }
) {
    try {
        const [updatedTodo] = await db.update(projectTodos)
            .set({
                ...updates,
                // Sync completed with status if status is provided
                ...(updates.status === "done" ? { completed: true } : updates.status ? { completed: false } : {}),
                // Sync status with completed if completed is provided and status is NOT provided
                ...(updates.completed !== undefined && !updates.status ? { status: updates.completed ? "done" : "todo" } : {}),
            })
            .where(eq(projectTodos.id, id))
            .returning()

        revalidatePath("/projects")
        return {
            ...updatedTodo,
            createdAt: updatedTodo.createdAt.toISOString(),
        }
    } catch (error) {
        console.error("Failed to update todo:", error)
        throw new Error("Failed to update todo")
    }
}

export async function deleteTodo(id: string) {
    try {
        await db.delete(projectTodos).where(eq(projectTodos.id, id))
        revalidatePath("/projects")
    } catch (error) {
        console.error("Failed to delete todo:", error)
        throw new Error("Failed to delete todo")
    }
}
