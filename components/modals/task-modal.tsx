"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useProjects } from "@/hooks/use-projects"
import { useUsers } from "@/hooks/use-users"
import { useCreateTask, useUpdateTask, type Task, type CreateTaskInput } from "@/hooks/use-tasks"
import { format, addDays } from "date-fns"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface TaskModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    task?: Task | null
}

export function TaskModal({ open, onOpenChange, task }: TaskModalProps) {
    const { data: projects } = useProjects()
    const { data: users } = useUsers()
    const createTask = useCreateTask()
    const updateTask = useUpdateTask()

    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        projectId: task?.projectId || "",
        priority: task?.priority || ("medium" as "low" | "medium" | "high"),
        status: task?.status || ("todo" as "todo" | "in_progress" | "review" | "done"),
        startDate: task?.startDate ? format(new Date(task.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        endDate: task?.endDate ? format(new Date(task.endDate), "yyyy-MM-dd") : format(addDays(new Date(), 3), "yyyy-MM-dd"),
        assigneeIds: task?.assignees.map((a) => a.id) || ([] as string[]),
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload: CreateTaskInput = {
            title: formData.title,
            description: formData.description || undefined,
            projectId: formData.projectId || undefined,
            priority: formData.priority,
            status: formData.status,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            assigneeIds: formData.assigneeIds.length > 0 ? formData.assigneeIds : undefined,
        }

        if (task) {
            await updateTask.mutateAsync({ id: task.id, ...payload })
        } else {
            await createTask.mutateAsync(payload)
        }

        onOpenChange(false)
    }

    const toggleAssignee = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            assigneeIds: prev.assigneeIds.includes(userId)
                ? prev.assigneeIds.filter((id) => id !== userId)
                : [...prev.assigneeIds, userId],
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{task ? "Edit Task" : "Create Task"}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{task ? "Edit existing task details" : "Enter details for new task"}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <form key={task?.id || 'create'} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Task title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Task description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select
                                value={formData.projectId}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, projectId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects?.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color || "#3b82f6" }} />
                                                {project.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: "low" | "medium" | "high") =>
                                    setFormData((prev) => ({ ...prev, priority: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: "todo" | "in_progress" | "review" | "done") =>
                                    setFormData((prev) => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Assignees</Label>
                        <div className="flex flex-wrap gap-2">
                            {users?.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => toggleAssignee(user.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${formData.assigneeIds.includes(user.id)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                                        }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`}
                                        alt={user.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
                            {createTask.isPending || updateTask.isPending ? "Saving..." : task ? "Update Task" : "Create Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

