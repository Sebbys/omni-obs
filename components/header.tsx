"use client"

import { useState } from "react"
import { Search, Bell, Menu, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { getInitials } from "@/lib/utils"

interface HeaderProps {
    onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const [searchFocused, setSearchFocused] = useState(false)
    const { data: session, isPending } = authClient.useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                },
            },
        })
    }

    return (
        <header className="h-14 px-4 md:px-6 border-b border-border bg-card flex items-center justify-between gap-4 shrink-0">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                {/* Mobile Search */}
                <Button variant="ghost" size="icon" className="sm:hidden">
                    <Search className="w-5 h-5" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-chart-5 rounded-full" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 px-2">
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback className="text-xs">
                                    {session?.user?.name ? getInitials(session.user.name) : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline text-sm font-medium">
                                {session?.user?.name || "User"}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
