
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TeamSkeleton() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 md:px-6 py-4 lg:py-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 border rounded-lg overflow-hidden">
                    <div className="p-4 border-b bg-gray-50/50">
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48 flex-1" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="h-fit">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-3 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-10" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                            <Skeleton className="h-3 w-32 ml-auto" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
