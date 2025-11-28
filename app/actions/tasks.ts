"use server"

import { db } from "@/db"
import { tasks, usersToTasks } from "@/db/schema"
import { eq, and, gte, lte, desc } from "drizzle-orm"
import { revalidatePath, revalidateTag, cacheTag } from "next/cache"

export async function getTasks(startDate?: string, endDate?: string) {
  "use cache"
  cacheTag("tasks")
  try {
    const whereConditions = []
    if (startDate) whereConditions.push(gte(tasks.startDate, new Date(startDate)))
    if (endDate) whereConditions.push(lte(tasks.endDate, new Date(endDate)))

    const data = await db.query.tasks.findMany({
      where: whereConditions.length ? and(...whereConditions) : undefined,
      with: {
        project: true,
        assignees: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(tasks.createdAt)],
    })

    return data.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      projectId: t.projectId,
      project: t.project ? {
        id: t.project.id,
        name: t.project.name,
        color: t.project.color,
      } : null,
      priority: t.priority,
      status: t.status,
      startDate: t.startDate ? t.startDate.toISOString() : "", // Handle potential nulls safely
      endDate: t.endDate ? t.endDate.toISOString() : "",
      progress: t.progress,
      assignees: t.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.image,
      })),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function createTask(data: {
  title: string
  description?: string
  projectId?: string
  priority?: "low" | "medium" | "high"
  status?: "todo" | "in_progress" | "review" | "done"
  startDate: string
  endDate: string
  assigneeIds?: string[]
}) {
  try {
    const [newTask] = await db.insert(tasks).values({
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      priority: data.priority || "medium",
      status: data.status || "todo",
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    }).returning()

    if (data.assigneeIds && data.assigneeIds.length > 0) {
      await db.insert(usersToTasks).values(
        data.assigneeIds.map((userId) => ({
          userId,
          taskId: newTask.id,
        }))
      )
    }

    revalidatePath("/tasks")
    // Return the complete task object with relations by fetching it again or constructing it
    // For simplicity/performance, we might just return the basic task and let the query invalidate
    // But to match the type Task, we need the structure.
    // Let's fetch it fresh to be safe.
    const [createdTask] = await db.query.tasks.findMany({
        where: eq(tasks.id, newTask.id),
        with: {
            project: true,
            assignees: { with: { user: true } }
        }
    })

    if (!createdTask) throw new Error("Failed to retrieve created task")

     return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      projectId: createdTask.projectId,
      project: createdTask.project ? {
        id: createdTask.project.id,
        name: createdTask.project.name,
        color: createdTask.project.color,
      } : null,
      priority: createdTask.priority,
      status: createdTask.status,
      startDate: createdTask.startDate ? createdTask.startDate.toISOString() : "",
      endDate: createdTask.endDate ? createdTask.endDate.toISOString() : "",
      progress: createdTask.progress,
      assignees: createdTask.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.image,
      })),
      createdAt: createdTask.createdAt.toISOString(),
      updatedAt: createdTask.updatedAt.toISOString(),
    }

  } catch (error) {
    console.error("Failed to create task:", error)
    throw new Error("Failed to create task")
  }
}

export async function updateTask(id: string, data: {
  title?: string
  description?: string
  projectId?: string
  priority?: "low" | "medium" | "high"
  status?: "todo" | "in_progress" | "review" | "done"
  startDate?: string
  endDate?: string
  progress?: number
  assigneeIds?: string[]
}) {
  try {
    await db.update(tasks)
      .set({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning()

    if (data.assigneeIds) {
      // Replace assignees: Delete existing, insert new
      await db.delete(usersToTasks).where(eq(usersToTasks.taskId, id))
      if (data.assigneeIds.length > 0) {
        await db.insert(usersToTasks).values(
          data.assigneeIds.map((userId) => ({
            userId,
            taskId: id,
          }))
        )
      }
    }

    revalidatePath("/tasks")
     const [freshTask] = await db.query.tasks.findMany({
        where: eq(tasks.id, id),
        with: {
            project: true,
            assignees: { with: { user: true } }
        }
    })

    if (!freshTask) throw new Error("Failed to retrieve updated task")

     return {
      id: freshTask.id,
      title: freshTask.title,
      description: freshTask.description,
      projectId: freshTask.projectId,
      project: freshTask.project ? {
        id: freshTask.project.id,
        name: freshTask.project.name,
        color: freshTask.project.color,
      } : null,
      priority: freshTask.priority,
      status: freshTask.status,
      startDate: freshTask.startDate ? freshTask.startDate.toISOString() : "",
      endDate: freshTask.endDate ? freshTask.endDate.toISOString() : "",
      progress: freshTask.progress,
      assignees: freshTask.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatarUrl: a.user.image,
      })),
      createdAt: freshTask.createdAt.toISOString(),
      updatedAt: freshTask.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Failed to update task:", error)
    throw new Error("Failed to update task")
  }
}

export async function deleteTask(id: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id))
    revalidatePath("/tasks")
  } catch (error) {
    console.error("Failed to delete task:", error)
    throw new Error("Failed to delete task")
  }
}
