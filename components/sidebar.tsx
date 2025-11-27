"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    Activity,
    Calendar,
    Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
    href: string
    icon: React.ElementType
    label: string
    active?: boolean
    badge?: string
    onClick?: () => void
}

function NavItem({ href, icon: Icon, label, active, badge, onClick }: NavItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
        >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{label}</span>
            {badge && <span className="ml-auto text-xs bg-chart-1 text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
        </Link>
    )
}

function SectionLabel({ label }: { label: string }) {
    return (
        <div className="px-3 mt-6 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    )
}

interface SidebarProps {
    onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname()

    const navItems = [
        { href: "/", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/projects", icon: FolderKanban, label: "Projects" },
        { href: "/team", icon: Users, label: "Team" },
        { href: "/calendar", icon: Calendar, label: "Calendar" },
    ]

    const managementItems = [
        { href: "/reports", icon: BarChart3, label: "Reports" },
        { href: "/notifications", icon: Bell, label: "Notifications", badge: "3" },
    ]

    const settingsItems = [
        { href: "/settings", icon: Settings, label: "Settings" },
        { href: "/help", icon: HelpCircle, label: "Help & Support" },
    ]

    return (
        <div className="w-64 h-full bg-card border-r border-border flex flex-col">
            {/* Logo */}
            <div className="p-4 flex items-center gap-3 border-b border-border">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-background" />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-foreground">TeamPulse</h1>
                    <p className="text-xs text-muted-foreground">Monitoring</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                <SectionLabel label="Overview" />
                {navItems.map((item) => (
                    <NavItem key={item.href} {...item} active={pathname === item.href} onClick={onNavigate} />
                ))}

                <SectionLabel label="Management" />
                {managementItems.map((item) => (
                    <NavItem key={item.href} {...item} active={pathname === item.href} onClick={onNavigate} />
                ))}

                <SectionLabel label="Settings" />
                {settingsItems.map((item) => (
                    <NavItem key={item.href} {...item} active={pathname === item.href} onClick={onNavigate} />
                ))}
            </nav>

            {/* Bottom Card */}
            <div className="p-3 m-2 bg-accent/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                    Track your team&apos;s progress and stay updated with real-time insights.
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-chart-1 flex items-center justify-center text-[10px] text-white font-medium">
                        TP
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">TeamPulse Pro</p>
                        <p className="text-[10px] text-muted-foreground">Upgrade available</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
