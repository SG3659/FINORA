import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PieChartSkeleton = () => (
   <Card className="!shadow-none border-1 border-gray-100 dark:border-border">
      <CardHeader className="pb-2">
         <Skeleton className="h-6 w-48" />
         <Skeleton className="h-4 w-32 mt-1" />
      </CardHeader>
      <CardContent className="h-[313px]">
         <div className="w-full flex items-center justify-center">
            <div className="relative w-[200px] h-[200px]">
               <Skeleton className="rounded-full w-full h-full" />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
               </div>
            </div>
         </div>
         <div className="mt-0 space-y-2">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Skeleton className="h-3 w-3 rounded-full" />
                     <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-12" />
               </div>
            ))}
         </div>
      </CardContent>
   </Card>
);
export default PieChartSkeleton