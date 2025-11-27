"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers, useDeleteUser, type User } from "@/hooks/use-users"
import { UserModal } from "@/components/modals/user-modal"

export function TeamView() {
    const { data: users, isLoading, error } = useUsers()
    const deleteUser = useDeleteUser()

    const [userModal, setUserModal] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    })

    const handleEditUser = (user: User) => {
        setUserModal({ open: true, user })
    }

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser.mutateAsync(userId)
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-foreground">Team Members</h1>
                    <p className="text-sm text-muted-foreground">Manage your team and their access.</p>
                </div>
                <Button onClick={() => setUserModal({ open: true, user: null })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                </Button>
            </div>

            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {error && (
                <div className="text-center text-destructive py-8">
                    <p>Failed to load users.</p>
                </div>
            )}

            {!isLoading && !error && users?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">No team members yet.</p>
                    <p className="text-xs mt-1">Add your first team member to get started.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users?.map((user) => (
                    <Card key={user.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {user.name}
                            </CardTitle>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditUser(user)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteUser(user.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-foreground">{user.email}</p>
                                {/* Add more user details here if available, e.g., role */}
                                <p className="text-xs text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <UserModal
                open={userModal.open}
                onOpenChange={(open) => setUserModal({ open, user: null })}
                user={userModal.user}
            />
        </div>
    )
}
