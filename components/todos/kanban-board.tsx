"use client"

import { useState, useMemo } from "react"
import {
    DndContext,
    defaultDropAnimationSideEffects,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    DropAnimation,
    MeasuringStrategy,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjectTodos, updateTodo, deleteTodo } from "@/app/actions/todos"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { AddTodoForm } from "./add-todo-form"
import { TodoSkeleton } from "./todo-skeleton"
import { toast } from "sonner"
import { useRef } from "react"

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

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
    const queryClient = useQueryClient()
    const [activeId, setActiveId] = useState<string | null>(null)
    const lastOverId = useRef<string | null>(null)

    const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
        queryKey: ["project-todos", projectId],
        queryFn: () => getProjectTodos(projectId) as Promise<Todo[]>,
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Keep it responsive
            },
        }),
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

            // Optimistically update query cache as well
            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (old) => {
                return old?.map((t) => (t.id === id ? { ...t, status: status as "todo" | "in_progress" | "review" | "done" } : t))
            })

            return { previousTodos }
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["project-todos", projectId], context.previousTodos)
            }
            toast.error(err.message || "Failed to move todo")
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
            toast.error(err.message || "Failed to delete todo")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] })
            toast.success("Todo deleted")
        },
    })

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const isActiveTask = active.data.current?.type === "Task"
        const isOverTask = over.data.current?.type === "Task"
        const isOverColumn = over.data.current?.type === "Column"

        if (!isActiveTask) return

        // Im dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (items) => {
                if (!items) return []
                const activeIndex = items.findIndex((t) => t.id === activeId)
                const overIndex = items.findIndex((t) => t.id === overId)

                if (items[activeIndex].status !== items[overIndex].status) {
                    const newItems = [...items]
                    newItems[activeIndex] = { ...newItems[activeIndex], status: items[overIndex].status }
                    return arrayMove(newItems, activeIndex, overIndex - 1 >= 0 ? overIndex - 1 : 0)
                }

                return arrayMove(items, activeIndex, overIndex)
            })
        }

        // Im dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (items) => {
                if (!items) return []
                const activeIndex = items.findIndex((t) => t.id === activeId)
                if (items[activeIndex].status !== overId) {
                    const newItems = [...items]
                    newItems[activeIndex] = { ...newItems[activeIndex], status: overId as "todo" | "in_progress" | "review" | "done" }
                    return arrayMove(newItems, activeIndex, activeIndex)
                }
                return items
            })
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        // Retrieve original status from the drag start snapshot
        const originalTodo = active.data.current as Todo | undefined
        const originalStatus = originalTodo?.status

        // Find current status from the cache (which was updated by DragOver)
        const currentTodos = queryClient.getQueryData<Todo[]>(["project-todos", projectId])
        const currentTodo = currentTodos?.find((t) => t.id === activeId)

        if (!currentTodo) {
            setActiveId(null)
            return
        }

        // If dropped over a column container
        if (COLUMNS.some((col) => col.id === overId)) {
            // If the status changed compared to ORIGINAL status, persist it
            if (originalStatus !== overId) {
                moveTodo({ id: activeId, status: overId })
            }
        } else {
            // If dropped over another item
            // We need to check if the status changed.
            // Since we don't persist order, we only care if status changed.
            // The 'over' item might be in a different column.

            // However, handleDragOver has already updated the status in the cache.
            // So currentTodo.status is already the new status.
            // We should compare originalStatus with currentTodo.status

            if (originalStatus && currentTodo.status !== originalStatus) {
                moveTodo({ id: activeId, status: currentTodo.status })
            }
        }

        setActiveId(null)
    }

    if (isLoading) {
        return <TodoSkeleton />
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
                Error loading todos: {error.message}
            </div>
        )
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
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
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

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTodo ? (
                        <div className="rotate-2 scale-105 cursor-grabbing">
                            <KanbanCard todo={activeTodo} onDelete={() => { }} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}