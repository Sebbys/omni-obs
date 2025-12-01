import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ChangelogSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-9 w-28" />
            </div>

            <div className="relative border-l border-border ml-4 space-y-8 pl-8 py-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="relative">
                        <Skeleton className="absolute -left-[39px] top-1 h-5 w-5 rounded-full" />
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[60%]" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}
