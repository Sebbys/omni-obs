"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"

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
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: {
            type: "Column",
        }
    })

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full min-h-[500px] w-[300px] rounded-lg p-4 border border-border/50 transition-colors duration-200",
                isOver ? "bg-muted/50 border-primary/20" : "bg-muted/30"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {todos.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                <SortableContext
                    id={id}
                    items={todos.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3 min-h-[100px]">
                        {todos.map((todo) => (
                            <KanbanCard key={todo.id} todo={todo} onDelete={onDelete} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}
