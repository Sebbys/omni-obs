"use client"

import { useTasks } from "@/hooks/use-tasks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function RecentActivity() {
    const { data: tasks, isLoading } = useTasks()

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!tasks?.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No recent activity</p>
            </div>
        )
    }

    const activities = tasks.slice(0, 5).map((task) => ({
        id: task.id,
        user: task.assignees?.[0]?.name || "Unknown",
        action: "updated task",
        target: task.title,
        time: task.updatedAt || task.createdAt,
    }))

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-muted">
                            {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
