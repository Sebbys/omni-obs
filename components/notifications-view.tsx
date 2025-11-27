"use client"

import { useState } from "react"
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Info,
    MessageSquare,
    UserPlus,
    FolderPlus,
    Check,
    Trash2,
    Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Notification {
    id: string
    type: "task" | "comment" | "team" | "project" | "system"
    title: string
    message: string
    read: boolean
    createdAt: Date
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "task",
        title: "Task Due Soon",
        message: "API Integration is due tomorrow",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
        id: "2",
        type: "comment",
        title: "New Comment",
        message: "Sarah left a comment on Dashboard Redesign",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        id: "3",
        type: "team",
        title: "New Team Member",
        message: "Alex Johnson joined the Engineering team",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
        id: "4",
        type: "project",
        title: "Project Updated",
        message: "Mobile App project status changed to In Progress",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        id: "5",
        type: "system",
        title: "Weekly Report Ready",
        message: "Your team's weekly performance report is available",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
]

const notificationIcons = {
    task: AlertCircle,
    comment: MessageSquare,
    team: UserPlus,
    project: FolderPlus,
    system: Info,
}

const notificationColors = {
    task: "text-chart-3",
    comment: "text-chart-1",
    team: "text-chart-2",
    project: "text-chart-4",
    system: "text-muted-foreground",
}

export function NotificationsView() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [filter, setFilter] = useState<"all" | "unread">("all")

    const unreadCount = notifications.filter((n) => !n.read).length

    const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Notifications</h1>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-chart-1 text-white">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">Stay updated with your team&apos;s activity</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <Check className="w-4 h-4 mr-1" />
                        Mark all read
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread
                        {unreadCount > 0 && (
                            <span className="ml-1.5 text-xs bg-chart-1 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {filteredNotifications.map((notification) => {
                                const Icon = notificationIcons[notification.type]
                                const iconColor = notificationColors[notification.type]

                                return (
                                    <Card
                                        key={notification.id}
                                        className={`transition-colors ${!notification.read ? "bg-accent/30" : ""}`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 ${iconColor}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                                                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {!notification.read && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => markAsRead(notification.id)}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                onClick={() => deleteNotification(notification.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!notification.read && <div className="w-2 h-2 bg-chart-1 rounded-full mt-2 shrink-0" />}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Clear All */}
            {notifications.length > 0 && (
                <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearAll}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear all notifications
                    </Button>
                </div>
            )}
        </div>
    )
}
