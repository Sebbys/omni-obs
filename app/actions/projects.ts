"use server"

import { db } from "@/db"
import { projects, projectMembers } from "@/db/schema"
import { eq, desc, inArray, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getSession() {
  return await auth.api.getSession({
    headers: await headers()
  })
}

export async function getProjects() {
  try {
    const session = await getSession()
    if (!session) return []

    // Get project IDs where user is a member
    const memberships = await db.query.projectMembers.findMany({
      where: eq(projectMembers.userId, session.user.id),
      columns: { projectId: true }
    })

    const projectIds = memberships.map(m => m.projectId)

    if (projectIds.length === 0) {
      return []
    }

    const data = await db.query.projects.findMany({
      where: inArray(projects.id, projectIds),
      orderBy: [desc(projects.createdAt)],
      with: {
        tasks: {
          with: {
            assignees: {
              with: {
                user: true
              }
            }
          }
        },
        todos: true, // Include project todos
        changelogs: true, // Include project changelogs
      }
    })

    return data.map(p => {
      // Calculate progress
      const totalTasks = p.tasks.length;
      // Simple progress: completed / total, or use the 'progress' field on tasks
      // Let's use the average of task progress if available, or simple completion status.
      // The UI uses a progress bar, so an average of the 'progress' field seems appropriate.
      const totalProgress = p.tasks.reduce((acc, t) => acc + (t.progress || 0), 0);
      const avgProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

      // Collect unique assignees
      const uniqueAssignees = new Map();
      p.tasks.forEach(t => {
        t.assignees.forEach(a => {
          if (!uniqueAssignees.has(a.user.id)) {
            uniqueAssignees.set(a.user.id, {
              id: a.user.id,
              name: a.user.name,
              avatarUrl: a.user.image
            });
          }
        });
      });

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        color: p.color,
        progress: avgProgress,
        assignees: Array.from(uniqueAssignees.values()),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        // Include todos and changelogs for Project Detail View
        todos: p.todos.map(todo => ({
          id: todo.id,
          content: todo.content,
          completed: todo.completed,
          createdAt: todo.createdAt.toISOString(),
        })),
        changelogs: p.changelogs.map(cl => ({
          id: cl.id,
          version: cl.version,
          title: cl.title,
          content: cl.content,
          date: cl.date.toISOString(),
          createdAt: cl.createdAt.toISOString(),
        })),
        tasks: p.tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          startDate: t.startDate?.toISOString() ?? null,
          endDate: t.endDate?.toISOString() ?? null,
          progress: t.progress,
        })),
      }
    })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function getProject(id: string) {
  try {
    const session = await getSession()
    if (!session) return null

    // Check membership
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, id),
        eq(projectMembers.userId, session.user.id)
      )
    })

    if (!membership) {
      // User is not a member, treat as not found or unauthorized
      return null
    }

    const data = await db.query.projects.findMany({
      where: eq(projects.id, id),
      with: {
        tasks: {
          with: {
            assignees: {
              with: {
                user: true
              }
            }
          }
        },
        todos: true, // Include project todos
        changelogs: true, // Include project changelogs
      }
    })

    if (!data || data.length === 0) {
      return null;
    }

    const p = data[0];
    const totalTasks = p.tasks.length;
    const totalProgress = p.tasks.reduce((acc, t) => acc + (t.progress || 0), 0);
    const avgProgress = totalTasks > 0 ? Math.round(totalProgress / totalTasks) : 0;

    const uniqueAssignees = new Map();
    p.tasks.forEach(t => {
      t.assignees.forEach(a => {
        if (!uniqueAssignees.has(a.user.id)) {
          uniqueAssignees.set(a.user.id, {
            id: a.user.id,
            name: a.user.name,
            avatarUrl: a.user.image
          });
        }
      });
    });

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      color: p.color,
      progress: avgProgress,
      assignees: Array.from(uniqueAssignees.values()),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      todos: p.todos.map(todo => ({
        id: todo.id,
        content: todo.content,
        completed: todo.completed,
        createdAt: todo.createdAt.toISOString(),
      })),
      changelogs: p.changelogs.map(cl => ({
        id: cl.id,
        version: cl.version,
        title: cl.title,
        content: cl.content,
        date: cl.date.toISOString(),
        createdAt: cl.createdAt.toISOString(),
      })),
      tasks: p.tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        startDate: t.startDate?.toISOString() ?? null,
        endDate: t.endDate?.toISOString() ?? null,
        progress: t.progress,
      })),
    }

  } catch (error) {
    console.error("Failed to fetch project :", error)
    throw new Error("Failed to fetch project")
  }
}

export async function createProject(data: { name: string; description?: string; color?: string }) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const [newProject] = await db.insert(projects).values({
      name: data.name,
      description: data.description,
      color: data.color,
    }).returning()

    // Add creator as owner
    await db.insert(projectMembers).values({
      projectId: newProject.id,
      userId: session.user.id,
      role: 'owner'
    })

    revalidatePath("/projects")
    return {
      ...newProject,
      progress: 0,
      assignees: [],
      createdAt: newProject.createdAt.toISOString(),
      updatedAt: newProject.updatedAt.toISOString(),
      todos: [],
      changelogs: [],
      tasks: [],
    }
  } catch (error) {
    console.error("Failed to create project:", error)
    throw new Error("Failed to create project")
  }
}

export async function updateProject(id: string, data: { name?: string; description?: string; color?: string }) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    // Check membership (optionally check role)
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, id),
        eq(projectMembers.userId, session.user.id)
      )
    })

    if (!membership) {
      throw new Error("Forbidden")
    }

    const [updatedProject] = await db.update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()

    revalidatePath("/projects")
    // Revalidate specific project page

    // Ideally we would re-fetch to get the calculated fields, but for update we might just return the basic info
    // or let the query invalidation handle it.
    // Let's return basic info but with 0/empty for calculated fields to satisfy the type if needed,
    // though the component will likely re-fetch. 
    return {
      ...updatedProject,
      progress: 0, // Placeholder, query invalidation will fetch real value
      assignees: [], // Placeholder
      createdAt: updatedProject.createdAt.toISOString(),
      updatedAt: updatedProject.updatedAt.toISOString(),
      todos: [],
      changelogs: [],
      tasks: [],
    }
  } catch (error) {
    console.error("Failed to update project:", error)
    throw new Error("Failed to update project")
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    // Check membership (optionally check role)
    const membership = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, id),
        eq(projectMembers.userId, session.user.id)
      )
    })

    if (!membership) {
      throw new Error("Forbidden")
    }

    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath("/projects")
  } catch (error) {
    console.error("Failed to delete project:", error)
    throw new Error("Failed to delete project")
  }
}
