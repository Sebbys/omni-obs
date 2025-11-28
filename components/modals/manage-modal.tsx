"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects, useDeleteProject, type Project } from "@/hooks/use-projects"
import { useUsers, useDeleteUser, type User } from "@/hooks/use-users"
import { ProjectModal } from "./project-modal"
import { UserModal } from "./user-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DialogDescription } from "@/components/ui/dialog"

interface ManageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ManageModal({ open, onOpenChange }: ManageModalProps) {
    const { data: projects, isLoading: projectsLoading } = useProjects()
    const { data: users, isLoading: usersLoading } = useUsers()
    const deleteProject = useDeleteProject()
    const deleteUser = useDeleteUser()

    const [projectModal, setProjectModal] = useState<{ open: boolean; project: Project | null }>({
        open: false,
        project: null,
    })
    const [userModal, setUserModal] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    })

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Manage</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>Manage projects and team members</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>

                    <Tabs defaultValue="projects" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="flex-1 overflow-y-auto space-y-2 mt-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 bg-transparent"
                                onClick={() => setProjectModal({ open: true, project: null })}
                            >
                                <Plus size={16} />
                                Add Project
                            </Button>

                            {projectsLoading && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {projects?.map((project) => (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color || "#3b82f6" }} />
                                        <div>
                                            <p className="font-medium text-foreground">{project.name}</p>
                                            {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setProjectModal({ open: true, project })}>
                                            <Pencil size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteProject.mutate(project.id)}
                                            disabled={deleteProject.isPending}
                                        >
                                            <Trash2 size={14} className="text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {!projectsLoading && projects?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No projects yet</p>
                            )}
                        </TabsContent>

                        <TabsContent value="users" className="flex-1 overflow-y-auto space-y-2 mt-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 bg-transparent"
                                onClick={() => setUserModal({ open: true, user: null })}
                            >
                                <Plus size={16} />
                                Add User
                            </Button>

                            {usersLoading && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {users?.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={user.image || "https://i.pravatar.cc/150?u=" + user.id} alt={user.name} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-foreground">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setUserModal({ open: true, user })}>
                                            <Pencil size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteUser.mutate(user.id)}
                                            disabled={deleteUser.isPending}
                                        >
                                            <Trash2 size={14} className="text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {!usersLoading && users?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No users yet</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <ProjectModal
                open={projectModal.open}
                onOpenChange={(open) => setProjectModal({ open, project: null })}
                project={projectModal.project}
            />

            <UserModal
                open={userModal.open}
                onOpenChange={(open) => setUserModal({ open, user: null })}
                user={userModal.user}
            />
        </>
    )
}
