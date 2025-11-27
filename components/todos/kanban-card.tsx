"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface KanbanCardProps {
    todo: Todo
    onDelete: (id: string) => void
}

const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
}

const categoryColors = {
    bug: "bg-red-500/10 text-red-500",
    feature: "bg-green-500/10 text-green-500",
    enhancement: "bg-purple-500/10 text-purple-500",
    documentation: "bg-blue-500/10 text-blue-500",
    design: "bg-pink-500/10 text-pink-500",
    other: "bg-gray-500/10 text-gray-500",
}

export function KanbanCard({ todo, onDelete }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id, data: todo })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 bg-muted/50 border-2 border-dashed border-primary/50 rounded-lg h-[100px]"
            />
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group">
                <CardContent className="p-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-tight">{todo.content}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onDelete(todo.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", categoryColors[todo.category])}>
                            {todo.category}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border-0", priorityColors[todo.priority])}>
                            {priorityColors[todo.priority] ? todo.priority : "medium"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
