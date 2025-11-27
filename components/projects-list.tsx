"use client"

import { useProjects } from "@/hooks/use-projects"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function ProjectsList() {
    const { data: projects, isLoading } = useProjects()

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-3 h-10 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-2 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!projects?.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No projects found</p>
                <p className="text-xs mt-1">Create your first project to get started</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {projects.slice(0, 5).map((project) => {
                return (
                    <Link href={`/projects/${project.id}`} key={project.id} className="block hover:bg-muted/50 transition-colors rounded-lg p-2 -mx-2">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-10 rounded-full" style={{ backgroundColor: project.color || "#3b82f6" }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-1.5" />
                            </div>
                            <div className="flex -space-x-2">
                                {project.assignees.slice(0, 3).map((assignee) => (
                                    <Avatar key={assignee.id} className="w-6 h-6 border-2 border-card">
                                        <AvatarImage src={assignee.avatarUrl || undefined} alt={assignee.name} className="object-cover" />
                                        <AvatarFallback className="text-[10px] bg-muted">
                                            {assignee.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {project.assignees.length === 0 && (
                                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                                        <span className="text-[10px] text-muted-foreground">-</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
