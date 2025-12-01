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

interface Todo {
    id: string
    content: string
    completed: boolean
    status: "todo" | "in_progress" | "review" | "done"
    category: "bug" | "feature" | "enhancement" | "documentation" | "design" | "other"
    priority: "low" | "medium" | "high"
    order: number
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
    const [activeState, setActiveState] = useState<{ status: Todo['status'], order: number } | null>(null)

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
        mutationKey: ["move-todo", projectId],
        mutationFn: async ({ id, status, order }: { id: string; status: string; order?: number }) => {
            return await updateTodo(id, {
                status: status as "todo" | "in_progress" | "review" | "done",
                order
            })
        },
        onMutate: async ({ id, status, order }) => {
            console.log("Starting mutation", { id, status, order })
            await queryClient.cancelQueries({ queryKey: ["project-todos", projectId] })
            const previousTodos = queryClient.getQueryData<Todo[]>(["project-todos", projectId])

            // Optimistically update query cache
            queryClient.setQueryData<Todo[]>(["project-todos", projectId], (old) => {
                if (!old) return []
                const newTodos = old.map((t) => (t.id === id ? {
                    ...t,
                    status: status as "todo" | "in_progress" | "review" | "done",
                    order: order ?? t.order
                } : t))
                
                // Sort by order to keep UI consistent with backend expectations
                return newTodos.sort((a, b) => a.order - b.order)
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
            // Only invalidate if no other moves are pending to prevent overwriting optimistic updates
            const pendingMutations = queryClient.isMutating({ mutationKey: ["move-todo", projectId] })
            if (pendingMutations === 0) {
                queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] })
            }
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
        const id = event.active.id as string
        setActiveId(id)
        const todo = todos.find(t => t.id === id)
        if (todo) {
            setActiveState({ status: todo.status, order: todo.order })
        }
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
                    return arrayMove(newItems, activeIndex, overIndex)
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

        const currentTodos = queryClient.getQueryData<Todo[]>(["project-todos", projectId]) || []
        const activeItem = currentTodos.find(t => t.id === activeId)

        if (!activeItem) {
            setActiveId(null)
            return
        }

        // Determine target status (overId can be column ID or task ID)
        let newStatus = activeItem.status
        if (COLUMNS.some(c => c.id === overId)) {
            newStatus = overId as Todo["status"]
        } else {
            const overItem = currentTodos.find(t => t.id === overId)
            if (overItem) newStatus = overItem.status
        }

        // Get items in the target column (current state from cache)
        const columnTodos = currentTodos.filter(t => t.status === newStatus)
        const activeIndex = columnTodos.findIndex(t => t.id === activeId)

        // Calculate New Order
        const prevItem = columnTodos[activeIndex - 1]
        const nextItem = columnTodos[activeIndex + 1]
        let newOrder = activeItem.order

        if (!prevItem && !nextItem) {
            newOrder = 1000
        } else if (!prevItem) {
            newOrder = nextItem.order / 2
        } else if (!nextItem) {
            newOrder = prevItem.order + 1000
        } else {
            newOrder = (prevItem.order + nextItem.order) / 2
        }

        // Trigger mutation if Status OR Order changed
        const hasStatusChanged = activeState ? activeState.status !== newStatus : activeItem.status !== newStatus
        const hasOrderChanged = Math.abs(newOrder - (activeState?.order ?? activeItem.order)) > 0.0001

        if (hasStatusChanged || hasOrderChanged) {
            // console.log("Dropping, triggering moveTodo", { activeId, status: newStatus, newOrder })
            moveTodo({ id: activeId, status: newStatus, order: newOrder })
        }

        setActiveId(null)
        setActiveState(null)
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