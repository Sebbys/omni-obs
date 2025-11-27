import { Skeleton } from "@/components/ui/skeleton"

export function TodoSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ))}
        </div>
    )
}
