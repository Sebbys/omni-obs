"use server"

import { db } from "@/db"
import { tasks, usersToTasks, users, projects } from "@/db/schema"
import { eq, and, gte, lte, desc, inArray } from "drizzle-orm"
import { revalidatePath, revalidateTag, cacheTag } from "next/cache"
import { sendEmail } from "@/lib/email"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getSession() {
  return await auth.api.getSession({
    headers: await headers()
  })
}

async function _getCachedTasks(startDate?: string, endDate?: string) {
  "use cache"
  cacheTag("tasks")

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
}

export async function getTasks(startDate?: string, endDate?: string) {
  try {
    const session = await getSession()
    if (!session) return []

    return await _getCachedTasks(startDate, endDate)
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
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

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

      // Send email notifications
      const assignedUsers = await db.query.users.findMany({
        where: inArray(users.id, data.assigneeIds),
      })

      const project = await db.query.projects.findFirst({
        where: eq(projects.id, data.projectId || ""),
      })

      await Promise.all(assignedUsers.map(user =>
        sendEmail({
          to: user.email,
          subject: `New Task Assignment: ${data.title}`,
          template: {
            type: 'task-assignment',
            props: {
              assigneeName: user.name,
              taskTitle: data.title,
              projectName: project?.name || "Unknown Project",
              taskUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tasks?taskId=${newTask.id}`, // Adjust URL as needed
            }
          }
        })
      ))
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
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

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

        // Send email notifications to NEWLY assigned users? 
        // Or all current assignees? 
        // For simplicity, let's send to all current assignees for now, 
        // but ideally we should diff. 
        // Given the "replace" logic, sending to all seems acceptable or at least consistent with "assignment".
        // To avoid spam, maybe we should only send if it's a new assignment, but we just deleted everything.
        // Let's send to all provided assigneeIds.

        const assignedUsers = await db.query.users.findMany({
          where: inArray(users.id, data.assigneeIds),
        })

        // We need to fetch the task to get the title if it wasn't updated, 
        // but we can just fetch the fresh task later. 
        // However, we need project info.

        const currentTask = await db.query.tasks.findFirst({
          where: eq(tasks.id, id),
          with: { project: true }
        })

        if (currentTask) {
          await Promise.all(assignedUsers.map(user =>
            sendEmail({
              to: user.email,
              subject: `Task Assignment Updated: ${data.title || currentTask.title}`,
              template: {
                type: 'task-assignment',
                props: {
                  assigneeName: user.name,
                  taskTitle: data.title || currentTask.title,
                  projectName: currentTask.project?.name || "Unknown Project",
                  taskUrl: `${process.env.NEXT_PUBLIC_APP_URL}/tasks?taskId=${id}`,
                }
              }
            })
          ))
        }
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
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    await db.delete(tasks).where(eq(tasks.id, id))
    revalidatePath("/tasks")
  } catch (error) {
    console.error("Failed to delete task:", error)
    throw new Error("Failed to delete task")
  }
}
