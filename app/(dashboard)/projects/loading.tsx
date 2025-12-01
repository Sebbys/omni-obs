import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        {/* Toolbar Skeleton */}
        <div className="px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
          <div className="relative flex-1 max-w-xs">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Timeline Controls & Header Skeleton */}
        <div className="px-4 md:px-6 py-4 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4 gap-2">
            <Skeleton className="h-8 w-16" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="w-16 hidden sm:block" />
          </div>

          {/* Calendar Grid Skeleton */}
          <div className="flex-1 overflow-auto relative border border-border rounded-lg bg-card">
            <div className="grid grid-cols-7 border-b border-border sticky top-0 bg-card z-30">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="py-3 text-center border-r border-border last:border-r-0">
                  <Skeleton className="h-3 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-6 mx-auto" />
                </div>
              ))}
            </div>
            <div className="p-4 grid grid-cols-7 gap-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="col-span-7 h-24 bg-muted/20 rounded-md animate-pulse" />
                ))}
            </div>
          </div>
        </div>
      </div>
  )
}
