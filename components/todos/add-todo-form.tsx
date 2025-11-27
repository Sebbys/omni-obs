"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTodo } from "@/app/actions/todos"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AddTodoFormProps {
    projectId: string
}

export function AddTodoForm({ projectId }: AddTodoFormProps) {
    const [content, setContent] = useState("")
    const [category, setCategory] = useState<string>("other")
    const [priority, setPriority] = useState<string>("medium")
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return await createTodo(
                projectId,
                content,
                category as "bug" | "feature" | "enhancement" | "documentation" | "design" | "other",
                priority as "low" | "medium" | "high"
            )
        },
        onSuccess: () => {
            setContent("")
            setCategory("other")
            setPriority("medium")
            queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] })
            toast.success("Todo added")
        },
        onError: () => {
            toast.error("Failed to add todo")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        mutate()
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a new task..."
                className="w-[300px]"
                disabled={isPending}
            />
            <Select value={category} onValueChange={setCategory} disabled={isPending}>
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="enhancement">Enhancement</SelectItem>
                    <SelectItem value="documentation">Docs</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority} disabled={isPending}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
            <Button type="submit" size="icon" disabled={isPending || !content.trim()}>
                <Plus className="h-4 w-4" />
            </Button>
        </form>
    )
}
