"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useCreateUser, useUpdateUser, type User } from "@/hooks/use-users"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface UserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
}

export function UserModal({ open, onOpenChange, user }: UserModalProps) {
    const createUser = useCreateUser()
    const updateUser = useUpdateUser()

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatarUrl: user?.avatarUrl || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            name: formData.name,
            email: formData.email,
            avatarUrl: formData.avatarUrl || undefined,
        }

        if (user) {
            await updateUser.mutateAsync({ id: user.id, ...payload })
        } else {
            await createUser.mutateAsync(payload)
        }

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{user ? "Edit User" : "Add User"}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{user ? "Edit existing user details" : "Enter details for new user"}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <form key={user?.id || 'create'} onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Full name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                            id="avatarUrl"
                            type="url"
                            value={formData.avatarUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                            {createUser.isPending || updateUser.isPending ? "Saving..." : user ? "Update" : "Add User"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

