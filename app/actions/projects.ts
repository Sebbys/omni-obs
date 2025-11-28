"use server"

import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath, revalidateTag, cacheTag } from "next/cache"

export async function getProjects() {
  "use cache"
  cacheTag("projects")
  try {
    const data = await db.query.projects.findMany({
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
  "use cache"
  cacheTag(`project-${id}`)
  try {
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
    const [newProject] = await db.insert(projects).values({
      name: data.name,
      description: data.description,
      color: data.color,
    }).returning()

    revalidatePath("/projects")
    revalidateTag("projects", "projects")
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
    const [updatedProject] = await db.update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()

    revalidatePath("/projects")
    revalidateTag("projects", 'projects')
    revalidateTag(`project-${id}`, 'projects')
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
    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath("/projects")
    revalidateTag("projects", "projects")
    revalidateTag(`project-${id}`, 'projects')
    // Revalidate specific project page
  } catch (error) {
    console.error("Failed to delete project:", error)
    throw new Error("Failed to delete project")
  }
}
