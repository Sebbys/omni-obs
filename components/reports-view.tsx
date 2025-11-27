"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"

export function ReportsView() {
    const { data: tasks } = useTasks()
    const { data: projects } = useProjects()

    // Defensive checks and explicit typing
    const safeTasks = tasks || []

    const tasksByStatus = {
        todo: safeTasks.filter((t) => t.status === "todo").length,
        in_progress: safeTasks.filter((t) => t.status === "in_progress").length,
        done: safeTasks.filter((t) => t.status === "done").length,
    }

    const tasksByPriority = {
        high: safeTasks.filter((t) => t.priority === "high").length,
        medium: safeTasks.filter((t) => t.priority === "medium").length,
        low: safeTasks.filter((t) => t.priority === "low").length,
    }

    const totalTasks = safeTasks.length || 1 // Avoid division by zero
    const totalProjects = projects?.length || 0

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-foreground">Reports</h1>
                    <p className="text-sm text-muted-foreground">Analyze your team&apos;s performance</p>
                </div>
                <Select defaultValue="7d">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">To Do</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-muted-foreground rounded-full"
                                        style={{ width: `${(tasksByStatus.todo / totalTasks) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{tasksByStatus.todo}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">In Progress</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-chart-1 rounded-full"
                                        style={{ width: `${(tasksByStatus.in_progress / totalTasks) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{tasksByStatus.in_progress}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Completed</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-chart-2 rounded-full"
                                        style={{ width: `${(tasksByStatus.done / totalTasks) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{tasksByStatus.done}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tasks by Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-5" />
                                <span className="text-sm">High</span>
                            </div>
                            <span className="text-sm font-medium">{tasksByPriority.high}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-3" />
                                <span className="text-sm">Medium</span>
                            </div>
                            <span className="text-sm font-medium">{tasksByPriority.medium}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-2" />
                                <span className="text-sm">Low</span>
                            </div>
                            <span className="text-sm font-medium">{tasksByPriority.low}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">{totalProjects}</div>
                        <p className="text-sm text-muted-foreground">Active projects</p>
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Total Tasks</span>
                                <span className="font-medium">{safeTasks.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for charts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                        <p className="text-sm">Chart visualization coming soon</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
