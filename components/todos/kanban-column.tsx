"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"

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

interface KanbanColumnProps {
    id: string
    title: string
    todos: Todo[]
    onDelete: (id: string) => void
}

export function KanbanColumn({ id, title, todos, onDelete }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ 
        id,
        data: {
            type: "Column",
        }
    })

    return (
        <div className="flex flex-col h-full min-h-[500px] w-[300px] bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {todos.length}
                </span>
            </div>

            <SortableContext id={id} items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef} className="flex-1 space-y-3">
                    {todos.map((todo) => (
                        <KanbanCard key={todo.id} todo={todo} onDelete={onDelete} />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}
