"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTodo, deleteTodo } from "@/app/actions/todos"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Todo {
    id: string
    content: string
    completed: boolean
    projectId: string
    createdAt: string
    status: "todo" | "in_progress" | "review" | "done"
    category: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other"
    priority: "low" | "medium" | "high"
}

interface TodoItemProps {
    todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
    const queryClient = useQueryClient()

    const { mutate: toggleTodo } = useMutation({
        mutationFn: async (completed: boolean) => {
            return await updateTodo(todo.id, { completed })
        },
        onMutate: async (newCompleted) => {
            await queryClient.cancelQueries({ queryKey: ["project-todos", todo.projectId] })
            const previousTodos = queryClient.getQueryData<Todo[]>(["project-todos", todo.projectId])
            queryClient.setQueryData<Todo[]>(["project-todos", todo.projectId], (old) => {
                return old?.map((t) =>
                    t.id === todo.id ? { ...t, completed: newCompleted } : t
                )
            })
            return { previousTodos }
        },
        onError: (err, newCompleted, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["project-todos", todo.projectId], context.previousTodos)
            }
            toast.error("Failed to update todo")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project-todos", todo.projectId] })
        },
    })

    const { mutate: removeTodo, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            return await deleteTodo(todo.id)
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["project-todos", todo.projectId] })
            const previousTodos = queryClient.getQueryData<Todo[]>(["project-todos", todo.projectId])
            queryClient.setQueryData<Todo[]>(["project-todos", todo.projectId], (old) => {
                return old?.filter((t) => t.id !== todo.id)
            })
            return { previousTodos }
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["project-todos", todo.projectId], context.previousTodos)
            }
            toast.error("Failed to delete todo")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project-todos", todo.projectId] })
            toast.success("Todo deleted")
        },
    })

    return (
        <div className="group flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => toggleTodo(checked as boolean)}
                    className="transition-transform active:scale-95"
                />
                <span
                    className={cn(
                        "text-sm truncate transition-all duration-200",
                        todo.completed && "text-muted-foreground line-through decoration-muted-foreground/50"
                    )}
                >
                    {todo.content}
                </span>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTodo()}
                disabled={isDeleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
