import { Skeleton } from "@/components/ui/skeleton"

export function AppSkeleton() {
    return (
        <div className="flex h-screen w-screen bg-background overflow-hidden">
            {/* Desktop Sidebar Skeleton */}
            <div className="hidden lg:flex w-64 h-full bg-card border-r border-border flex-col">
                {/* Logo */}
                <div className="p-4 flex items-center gap-3 border-b border-border">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>

                {/* Search */}
                <div className="px-3 py-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-2 space-y-6">
                    {/* Overview Section */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16 mx-3 mb-2" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    {/* Management Section */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 mx-3 mb-2" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    {/* Settings Section */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16 mx-3 mb-2" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                </div>

                {/* Bottom Card */}
                <div className="p-3 m-2">
                    <Skeleton className="h-16 w-full rounded-lg" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Skeleton */}
                <header className="h-14 px-4 md:px-6 border-b border-border bg-card flex items-center justify-between gap-4 shrink-0">
                    {/* Left side (Mobile Menu Trigger) */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <Skeleton className="w-9 h-9 rounded-md" />
                    </div>
                    <div className="hidden lg:block" /> {/* Spacer for desktop alignment if needed */}

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-9 h-9 rounded-md sm:hidden" /> {/* Mobile Search */}
                        <Skeleton className="w-9 h-9 rounded-md" /> {/* Notifications */}
                        <Skeleton className="w-24 h-9 rounded-md hidden md:block" /> {/* User Menu Desktop */}
                        <Skeleton className="w-9 h-9 rounded-full md:hidden" /> {/* User Avatar Mobile */}
                    </div>
                </header>

                {/* Page Content Skeleton */}
                <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <Skeleton className="h-10 w-32 hidden md:block" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                    </div>

                    {/* Main Chart/Content Area */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                        <Skeleton className="col-span-3 h-[400px] rounded-xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}
