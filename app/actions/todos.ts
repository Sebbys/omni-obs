"use server"

import { db } from "@/db"
import { projectTodos, projectMembers } from "@/db/schema"
import { eq, desc, and, asc, max } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function checkProjectMembership(projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    // console.log(`Checking membership for user ${session.user.id} in project ${projectId}`)

    const membership = await db.query.projectMembers.findFirst({
        where: and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, session.user.id)
        )
    })

    if (!membership) {
        console.error(`Membership check failed for user ${session.user.id} in project ${projectId}`)
        throw new Error("Forbidden: You are not a member of this project")
    }

    return session.user
}

export async function getProjectTodos(projectId: string) {
    try {
        await checkProjectMembership(projectId)

        const todos = await db.query.projectTodos.findMany({
            where: eq(projectTodos.projectId, projectId),
            orderBy: [asc(projectTodos.order), desc(projectTodos.createdAt)],
        })
        return todos.map(todo => ({
            ...todo,
            createdAt: todo.createdAt.toISOString(),
        }))
    } catch (error) {
        console.error("Failed to fetch project todos:", error)
        throw error // Re-throw to handle in UI
    }
}

export async function createTodo(
    projectId: string,
    content: string,
    category: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other" = "other",
    priority: "low" | "medium" | "high" = "medium"
) {
    try {
        await checkProjectMembership(projectId)

        // Get max order
        const [result] = await db.select({ maxOrder: max(projectTodos.order) })
            .from(projectTodos)
            .where(eq(projectTodos.projectId, projectId))

        const newOrder = (result?.maxOrder ?? 0) + 1000

        const [newTodo] = await db.insert(projectTodos).values({
            projectId,
            content,
            category,
            priority,
            status: "todo",
            order: newOrder,
        }).returning()

        revalidatePath(`/projects/${projectId}`)
        return {
            ...newTodo,
            createdAt: newTodo.createdAt.toISOString(),
        }
    } catch (error) {
        console.error("Failed to create todo:", error)
        throw error
    }
}

export async function updateTodo(
    id: string,
    updates: {
        completed?: boolean
        status?: "todo" | "in_progress" | "review" | "done"
        category?: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other"
        priority?: "low" | "medium" | "high"
        order?: number
    }
) {
    try {
        // First fetch the todo to get the projectId
        const todo = await db.query.projectTodos.findFirst({
            where: eq(projectTodos.id, id),
            columns: { projectId: true }
        })

        if (!todo) {
            throw new Error("Todo not found")
        }

        await checkProjectMembership(todo.projectId)

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

        revalidatePath(`/projects/${todo.projectId}`)
        return {
            ...updatedTodo,
            createdAt: updatedTodo.createdAt.toISOString(),
        }
    } catch (error) {
        console.error("Failed to update todo:", error)
        throw error
    }
}

export async function deleteTodo(id: string) {
    try {
        // First fetch the todo to get the projectId
        const todo = await db.query.projectTodos.findFirst({
            where: eq(projectTodos.id, id),
            columns: { projectId: true }
        })

        if (!todo) {
            throw new Error("Todo not found")
        }

        await checkProjectMembership(todo.projectId)

        await db.delete(projectTodos).where(eq(projectTodos.id, id))
        revalidatePath(`/projects/${todo.projectId}`)
    } catch (error) {
        console.error("Failed to delete todo:", error)
        throw error
    }
}
