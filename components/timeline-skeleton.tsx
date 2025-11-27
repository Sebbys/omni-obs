import { Skeleton } from "@/components/ui/skeleton"

export function TimelineSkeleton() {
  return (
    <div className="flex-1 overflow-auto relative border border-border rounded-lg bg-card h-full min-h-[500px]">
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-border sticky top-0 bg-card z-30">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="py-3 text-center border-r border-border last:border-r-0">
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
        ))}
      </div>

      {/* Tasks Grid Skeleton */}
      <div className="p-3 md:p-4 grid grid-cols-7 gap-y-3 gap-x-2 relative">
         {/* Background Grid Lines */}
         <div className="absolute inset-0 grid grid-cols-7 pointer-events-none z-0">
            {[...Array(7)].map((_, i) => (
                <div key={i} className="border-r border-border/50 h-full last:border-r-0" />
            ))}
        </div>

        {/* Fake Task Rows */}
        {[...Array(5)].map((_, rowI) => (
            <div key={rowI} className="col-span-7 relative h-8">
                 {/* Randomly place skeletons to simulate tasks */}
                 {rowI % 2 === 0 ? (
                    <Skeleton className="absolute left-[14%] w-[28%] h-full rounded-md opacity-50" /> 
                 ) : (
                    <Skeleton className="absolute left-[42%] w-[42%] h-full rounded-md opacity-50" />
                 )}
            </div>
        ))}
        
         {[...Array(3)].map((_, rowI) => (
            <div key={rowI} className="col-span-7 relative h-8">
                 <Skeleton className="absolute left-[0%] w-[14%] h-full rounded-md opacity-40" />
            </div>
        ))}
      </div>
    </div>
  )
}
