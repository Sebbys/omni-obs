"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"

export function SettingsView() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weekly: true,
    })
    
    const { data: session } = authClient.useSession()
    const user = session?.user

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Profile Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={user?.image || undefined} />
                                    <AvatarFallback>
                                        {user?.name ? getInitials(user.name) : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm">
                                    Change avatar
                                </Button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Full Name</Label>
                                    <Input id="firstName" defaultValue={user?.name || ""} />
                                </div>
                                {/* Removed Last Name splitting for simplicity, keeping it consistent with Better Auth "name" field */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" defaultValue={user?.role || "user"} disabled />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notification Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive email updates about your tasks</p>
                                </div>
                                <Switch
                                    checked={notifications.email}
                                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">Get push notifications on your device</p>
                                </div>
                                <Switch
                                    checked={notifications.push}
                                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Weekly Digest</p>
                                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your team&apos;s progress</p>
                                </div>
                                <Switch
                                    checked={notifications.weekly}
                                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weekly: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Team Settings</CardTitle>
                            <CardDescription>Manage your team configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="teamName">Team Name</Label>
                                <Input id="teamName" defaultValue="Engineering Team" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="teamDesc">Description</Label>
                                <Input id="teamDesc" defaultValue="Product development and engineering" />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
