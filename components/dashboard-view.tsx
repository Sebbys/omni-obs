"use client"

import type React from "react"

import { useMemo } from "react"
import { FolderKanban, CheckCircle2, Clock, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/use-tasks"
import { useUsers } from "@/hooks/use-users"
import { useProjects } from "@/hooks/use-projects"
import { RecentActivity } from "@/components/recent-activity"
import { ProjectsList } from "@/components/projects-list"

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: "positive" | "negative" | "neutral"
    icon: React.ElementType
    iconColor: string
}

function StatCard({ title, value, change, changeType, icon: Icon, iconColor }: StatCardProps) {
    return (
        <Card className="bg-card">
            <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl md:text-3xl font-semibold mt-1">{value}</p>
                        {change && (
                            <div className="flex items-center gap-1 mt-2">
                                {changeType === "positive" ? (
                                    <ArrowUpRight className="w-3 h-3 text-chart-2" />
                                ) : changeType === "negative" ? (
                                    <ArrowDownRight className="w-3 h-3 text-chart-5" />
                                ) : null}
                                <span
                                    className={`text-xs ${changeType === "positive"
                                        ? "text-chart-2"
                                        : changeType === "negative"
                                            ? "text-chart-5"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {change}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function DashboardView() {
    const { data: tasks } = useTasks()
    const { data: users } = useUsers()
    const { data: projects } = useProjects()

    const stats = useMemo(() => {
        const totalTasks = tasks?.length || 0
        const completedTasks = tasks?.filter((t) => t.status === "done").length || 0
        const inProgressTasks = tasks?.filter((t) => t.status === "in_progress").length || 0
        const totalProjects = projects?.length || 0
        const totalMembers = users?.length || 0

        return {
            totalProjects,
            completedTasks,
            inProgressTasks,
            totalMembers,
        }
    }, [tasks, users, projects])

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your team.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Projects"
                    value={stats.totalProjects}
                    change="+2 this month"
                    changeType="positive"
                    icon={FolderKanban}
                    iconColor="bg-chart-1/10 text-chart-1"
                />
                <StatCard
                    title="Completed Tasks"
                    value={stats.completedTasks}
                    change="+12% vs last week"
                    changeType="positive"
                    icon={CheckCircle2}
                    iconColor="bg-chart-2/10 text-chart-2"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgressTasks}
                    change="3 due today"
                    changeType="neutral"
                    icon={Clock}
                    iconColor="bg-chart-3/10 text-chart-3"
                />
                <StatCard
                    title="Team Members"
                    value={stats.totalMembers}
                    change="+1 new member"
                    changeType="positive"
                    icon={Users}
                    iconColor="bg-chart-4/10 text-chart-4"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Projects List */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium">Active Projects</CardTitle>
                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ProjectsList />
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
