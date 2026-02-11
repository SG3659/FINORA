import { Skeleton } from "@/components/ui/skeleton";
import {
   Card,
   CardContent,
   CardHeader,
} from "@/components/ui/card";
const ChartSkeleton = () => (
   <Card className="!shadow-none border-1 border-gray-100 dark:border-border !pt-0">
      <CardHeader className="flex flex-col items-stretch !space-y-0 border-b border-gray-100 dark:border-border !p-0 pr-1 sm:flex-row">
         <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0 sm:py-0">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
         </div>
         <div className="flex">
            {[1, 2].map((i) => (
               <div
                  key={i}
                  className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
            sm:border-l border-gray-100 dark:border-border sm:px-4 sm:py-6 min-w-36"
               >
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-8 w-24 mx-auto mt-1 sm:h-12" />
               </div>
            ))}
         </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]">
         <Skeleton className="h-full w-full" />
      </CardContent>
   </Card>
);
export default ChartSkeleton