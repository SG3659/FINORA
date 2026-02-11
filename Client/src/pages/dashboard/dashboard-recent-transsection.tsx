import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table/transaction-table";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardAction,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
   return (
      <Card className="!shadow-none border-1 border-gray-100 dark:border-border">
         <CardHeader className="!pb-0 grid grid-rows-1">
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
            <CardAction>
               <Button
                  asChild
                  variant="link"
                  className="!text-foreground dark:!text-gray-200 !font-normal"
               >
                  <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
               </Button>
            </CardAction>
         </CardHeader>
         <CardContent className="mt-4">
            <TransactionTable pageSize={10} isShowPagination={false} />
         </CardContent>
      </Card>
   );
};

export default DashboardRecentTransactions;