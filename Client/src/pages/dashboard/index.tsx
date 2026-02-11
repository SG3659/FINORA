import React, { useState } from 'react'
import PageLayout from "@/components/page-layout";
import { DateRangeType } from '@/@types/analytic';
import DashboardSummary from "../../components/dashboard/dashboard-summary";
import DashboardRecentTransactions from "./dashboard-recent-transsection"
import { useTypedSelector } from "@/redux/hook";


const Dashboard = () => {
   const { user } = useTypedSelector((state) => state.auth);

   const [dateRange, _setDateRange] = useState<DateRangeType>(null);
   return (
      <div className="w-full flex flex-col">
         <PageLayout className="space-y-6"
            renderPageHeader={
               <DashboardSummary
                  dateRange={dateRange}
                  setDateRange={_setDateRange}
                  title={`Welcome back, ${user?.name || "Unknow"}`}
                  subtitle={"This is your overview report for the selected period"}
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
