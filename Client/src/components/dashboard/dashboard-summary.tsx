
import DashboardHeader from "./dashboard-header";
import DashboardStats from "./dashboard-stats";
import { DateRangeType } from "@/@types/analytic";

const DashboardSummary = ({
   dateRange,
   setDateRange,
   title,
   subtitle
}: {
   dateRange?: DateRangeType;
   setDateRange?: (range: DateRangeType) => void;
   title: string,
   subtitle: string
}) => {

   return (
      <div className="w-full space-y-10">
         <DashboardHeader
            title={title}
            subtitle={subtitle}
            dateRange={dateRange}
            setDateRange={setDateRange}
         />
         <DashboardStats dateRange={dateRange} />
      </div>
   );
};

export default DashboardSummary;
