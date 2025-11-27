import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTasks, createTask, updateTask, deleteTask } from "@/app/actions/tasks"

export interface TaskAssignee {
    id: string
    name: string
    email: string
    avatarUrl: string | null
}

export interface TaskProject {
    id: string
    name: string
    color: string | null
}

export interface Task {
    id: string
    title: string
    description: string | null
    projectId: string | null
    project: TaskProject | null
    priority: "low" | "medium" | "high"
    status: "todo" | "in_progress" | "review" | "done"
    startDate: string
    endDate: string
    progress: number
    assignees: TaskAssignee[]
    createdAt: string
    updatedAt: string
}

export interface CreateTaskInput {
    title: string
    description?: string
    projectId?: string
    priority?: "low" | "medium" | "high"
    status?: "todo" | "in_progress" | "review" | "done"
    startDate: string
    endDate: string
    assigneeIds?: string[]
}

export interface UpdateTaskInput {
    id: string
    title?: string
    description?: string
    projectId?: string
    priority?: "low" | "medium" | "high"
    status?: "todo" | "in_progress" | "review" | "done"
    startDate?: string
    endDate?: string
    progress?: number
    assigneeIds?: string[]
}

// Query hook for fetching tasks
export function useTasks(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ["tasks", startDate, endDate],
        queryFn: () => getTasks(startDate, endDate),
    })
}

// Mutation hook for creating tasks
export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })
}

// Mutation hook for updating tasks
export function useUpdateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, ...data }: UpdateTaskInput) => updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })
}

// Mutation hook for deleting tasks
export function useDeleteTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
    })
}
