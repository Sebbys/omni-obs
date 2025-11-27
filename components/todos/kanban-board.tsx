"use client"

import { useState, useMemo } from "react"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjectTodos, updateTodo, deleteTodo } from "@/app/actions/todos"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { AddTodoForm } from "./add-todo-form"
import { TodoSkeleton } from "./todo-skeleton"
import { toast } from "sonner"

interface Todo {
    id: string
    content: string
    completed: boolean
    status: "todo" | "in_progress" | "review" | "done"
    category: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other"
    priority: "low" | "medium" | "high"
    projectId: string
    createdAt: string
}

interface KanbanBoardProps {
    projectId: string
}

const COLUMNS = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
]

export function KanbanBoard({ projectId }: KanbanBoardProps) {
    const queryClient = useQueryClient()
    const [activeId, setActiveId] = useState<string | null>(null)

    const { data: todos = [], isLoading } = useQuery<Todo[]>({
        queryKey: ["project-todos", projectId],
        queryFn: () => getProjectTodos(projectId) as Promise<Todo[]>,
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const columns = useMemo(() => {
        const cols: Record<string, Todo[]> = {
            todo: [],
            in_progress: [],
            review: [],
            done: [],
        }
        todos.forEach((todo) => {
            if (cols[todo.status]) {
                cols[todo.status].push(todo)
            } else {
                // Fallback for unknown status
                cols.todo.push(todo)
            }
        })
        return cols
    }, [todos])

    const { mutate: moveTodo } = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            return await updateTodo(id, { status: status as "todo" | "in_progress" | "review" | "done" })
        },
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ["project-todos", projectId] })
            const previousTodos = queryClient.getQueryData<Todo[]>(["project-todos", projectId])

            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (old) => {
                return old?.map((t) => (t.id === id ? { ...t, status: status as "todo" | "in_progress" | "review" | "done" } : t))
            })

            return { previousTodos }
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["project-todos", projectId], context.previousTodos)
            }
            toast.error("Failed to move todo")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] })
        },
    })

    const { mutate: removeTodo } = useMutation({
        mutationFn: async (id: string) => {
            return await deleteTodo(id)
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["project-todos", projectId] })
            const previousTodos = queryClient.getQueryData<Todo[]>(["project-todos", projectId])

            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (old) => {
                return old?.filter((t) => t.id !== id)
            })

            return { previousTodos }
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["project-todos", projectId], context.previousTodos)
            }
            toast.error("Failed to delete todo")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] })
            toast.success("Todo deleted")
        },
    })

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeTodo = todos.find((t) => t.id === activeId)
        if (!activeTodo) return

        // If dropped over a column container
        if (COLUMNS.some((col) => col.id === overId)) {
            if (activeTodo.status !== overId) {
                moveTodo({ id: activeId, status: overId })
            }
        } else {
            // If dropped over another item
            const overTodo = todos.find((t) => t.id === overId)
            if (overTodo && activeTodo.status !== overTodo.status) {
                moveTodo({ id: activeId, status: overTodo.status })
            }
        }

        setActiveId(null)
    }

    if (isLoading) {
        return <TodoSkeleton />
    }

    const activeTodo = activeId ? todos.find((t) => t.id === activeId) : null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Project Board</h2>
                <AddTodoForm projectId={projectId} />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            todos={columns[col.id]}
                            onDelete={removeTodo}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTodo ? <KanbanCard todo={activeTodo} onDelete={() => { }} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
