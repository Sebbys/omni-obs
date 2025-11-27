import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users"

export interface User {
    id: string
    email: string
    name: string
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
}

export interface CreateUserInput {
    email: string
    name: string
    avatarUrl?: string
}

export interface UpdateUserInput {
    id: string
    email?: string
    name?: string
    avatarUrl?: string
}

export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }: UpdateUserInput) => updateUser(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    })
}
