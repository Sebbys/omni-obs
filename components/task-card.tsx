"use client"

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/hooks/use-tasks"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface TaskCardProps {
    task: Task
    startDay: number
    span: number
    row: number
    onEdit?: () => void
    onDelete?: () => void
}

export default function TaskCard({ task, startDay, span, row, onEdit, onDelete }: TaskCardProps) {
    const getPriorityColor = (p: string) => {
        switch (p) {
            case "high":
                return "bg-chart-5/10 text-chart-5 border-chart-5/20"
            case "medium":
                return "bg-chart-3/10 text-chart-3 border-chart-3/20"
            case "low":
                return "bg-chart-2/10 text-chart-2 border-chart-2/20"
            default:
                return "bg-muted text-muted-foreground border-border"
        }
    }

    const priorityStyle = getPriorityColor(task.priority)
    const dateRange = `${format(new Date(task.startDate), "MMM d")} - ${format(new Date(task.endDate), "MMM d")}`
    const color = task.project?.color || "#3b82f6"

    return (
        <div
            className={cn(
                "relative bg-secondary rounded-lg p-2.5 md:p-3 border border-border",
                "h-auto min-h-[90px] md:min-h-[100px] flex flex-col justify-between",
                "group hover:border-muted-foreground/30 transition-colors cursor-pointer overflow-hidden z-10",
            )}
            style={{
                gridColumn: `${startDay + 1} / span ${span}`,
                gridRow: row + 1,
            }}
        >
            {/* Top Row */}
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-foreground line-clamp-1">{task.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{dateRange}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="w-3.5 h-3.5 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-2">
                <div
                    className={cn(
                        "px-1.5 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 capitalize",
                        priorityStyle,
                    )}
                >
                    <div className="w-1 h-1 rounded-full bg-current" />
                    {task.priority}
                </div>

                <div className="flex -space-x-1.5">
                    {task.assignees?.slice(0, 2).map((user) => (
                        <Avatar key={user.id} className="w-5 h-5 border border-secondary">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="text-[8px]">{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    ))}
                    {task.assignees && task.assignees.length > 2 && (
                        <div className="w-5 h-5 rounded-full border border-secondary bg-muted flex items-center justify-center text-[8px] text-muted-foreground">
                            +{task.assignees.length - 2}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Color Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg" style={{ backgroundColor: color }} />
        </div>
    )
}
