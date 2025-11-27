"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useUsers } from "@/hooks/use-users"

export function StatsOverview() {
    const { data: tasks } = useTasks()
    const { data: projects } = useProjects()
    const { data: users } = useUsers()

    const stats = useMemo(() => {
        const totalTasks = tasks?.length || 0
        const completedTasks = tasks?.filter((t) => t.status === "done").length || 0
        const inProgressTasks = tasks?.filter((t) => t.status === "in_progress").length || 0
        const todoTasks = tasks?.filter((t) => t.status === "todo").length || 0

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        const highPriority = tasks?.filter((t) => t.priority === "high").length || 0
        const mediumPriority = tasks?.filter((t) => t.priority === "medium").length || 0
        const lowPriority = tasks?.filter((t) => t.priority === "low").length || 0

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            completionRate,
            highPriority,
            mediumPriority,
            lowPriority,
            totalProjects: projects?.length || 0,
            totalMembers: users?.length || 0,
        }
    }, [tasks, projects, users])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Task Completion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completionRate}%</div>
                    <Progress value={stats.completionRate} className="mt-2 h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                        {stats.completedTasks} of {stats.totalTasks} tasks completed
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tasks by Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">To Do</span>
                            <span className="font-medium">{stats.todoTasks}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">In Progress</span>
                            <span className="font-medium">{stats.inProgressTasks}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">{stats.completedTasks}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Priority Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-5" />
                                <span className="text-muted-foreground">High</span>
                            </div>
                            <span className="font-medium">{stats.highPriority}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-3" />
                                <span className="text-muted-foreground">Medium</span>
                            </div>
                            <span className="font-medium">{stats.mediumPriority}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-2" />
                                <span className="text-muted-foreground">Low</span>
                            </div>
                            <span className="font-medium">{stats.lowPriority}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Projects</span>
                            <span className="font-medium">{stats.totalProjects}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Members</span>
                            <span className="font-medium">{stats.totalMembers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg Tasks/Member</span>
                            <span className="font-medium">
                                {stats.totalMembers > 0 ? Math.round(stats.totalTasks / stats.totalMembers) : 0}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
