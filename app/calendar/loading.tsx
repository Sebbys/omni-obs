import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="w-16 hidden sm:block" />
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-border">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="py-3 text-center border-r border-border last:border-r-0">
                  <Skeleton className="h-3 w-8 mx-auto" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-border last:border-r-0">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
