"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectsList } from "@/components/projects-list"
import { ProjectModal } from "@/components/modals/project-modal"

export function ProjectsView() {
    const [projectModalOpen, setProjectModalOpen] = useState(false)

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your projects and tasks</p>
                </div>
                <Button onClick={() => setProjectModalOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Project
                </Button>
            </div>

            <ProjectsList />

            <ProjectModal
                open={projectModalOpen}
                onOpenChange={setProjectModalOpen}
                project={null}
            />
        </div>
    )
}
