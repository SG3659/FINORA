
import { useTypedSelector } from "@/redux/hook";
import DashboardHeader from "./_components/dashboard-header";
import DashboardStats from "./_components/dashboard-stats";
import { DateRangeType } from "@/@types/analytic";

const DashboardSummary = ({
   dateRange,
   setDateRange,
}: {
   dateRange?: DateRangeType;
   setDateRange?: (range: DateRangeType) => void;
}) => {
   const { user } = useTypedSelector((state) => state.auth);

   return (
      <div className="w-full space-y-10">
         <DashboardHeader
            title={`Welcome back, ${user?.name || "Unknow"}`}
            subtitle="This is your overview report for the selected period"
            dateRange={dateRange}
            setDateRange={setDateRange}
         />
         <DashboardStats dateRange={dateRange} />
      </div>
   );
};

export default DashboardSummary;
