"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useCreateProject, useUpdateProject, type Project } from "@/hooks/use-projects"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project?: Project | null
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export function ProjectModal({ open, onOpenChange, project }: ProjectModalProps) {
    const createProject = useCreateProject()
    const updateProject = useUpdateProject()

    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
        color: project?.color || "#3b82f6",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (project) {
            await updateProject.mutateAsync({ id: project.id, ...formData })
        } else {
            await createProject.mutateAsync(formData)
        }

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{project ? "Edit Project" : "Create Project"}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{project ? "Edit existing project details" : "Enter details for new project"}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <form key={project?.id || 'create'} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Project name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Project description"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                    className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110" : ""
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
                            {createProject.isPending || updateProject.isPending ? "Saving..." : project ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

