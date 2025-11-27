import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjects, createProject, updateProject, deleteProject } from "@/app/actions/projects"

export interface Project {
    id: string
    name: string
    description: string | null
    color: string | null
    progress: number
    assignees: {
        id: string
        name: string
        avatarUrl: string | null
    }[]
    tasks: {
        id: string
        title: string
        status: "todo" | "in_progress" | "review" | "done"
        priority: "low" | "medium" | "high"
        startDate: string | null
        endDate: string | null
        progress: number
    }[]
    todos: {
        id: string
        content: string
        completed: boolean
        createdAt: string
    }[]
    changelogs: {
        id: string
        version: string
        title: string
        content: string
        date: string
        createdAt: string
    }[]
    createdAt: string
    updatedAt: string
}

export interface CreateProjectInput {
    name: string
    description?: string
    color?: string
}

export interface UpdateProjectInput {
    id: string
    name?: string
    description?: string
    color?: string
}

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjects(),
    })
}

export function useCreateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    })
}

export function useUpdateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }: UpdateProjectInput) => updateProject(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    })
}

export function useDeleteProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    })
}
