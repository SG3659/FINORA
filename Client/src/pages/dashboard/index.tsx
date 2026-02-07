import React, { useState } from 'react'
import PageLayout from "@/components/page-layout";
import { DateRangeType } from '@/@types/analytic';
import DashboardSummary from "./dashboard-summary";
import DashboardRecentTransactions from "./_components/dashboard-recent-transsection"
const Dashboard = () => {
   const [dateRange, _setDateRange] = useState<DateRangeType>(null);
   return (
      <div className="w-full flex flex-col">
         <PageLayout className="space-y-6"
            renderPageHeader={
               <DashboardSummary
                  dateRange={dateRange}
                  setDateRange={_setDateRange}
               />
            }
         >
            <div className="w-full mt-0">
               <DashboardRecentTransactions />
            </div>

         </PageLayout>
      </div>
   )
}

export default Dashboard 
