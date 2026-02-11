import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const cardSkeleton = () => {
   return (
      <Card className="w-full max-w-xs">
         <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
         </CardHeader>
      </Card>
   )
}

export default cardSkeleton
