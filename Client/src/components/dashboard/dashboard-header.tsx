import { DateRangeSelect, } from "@/components/date-range-select";
import { DateRangeType } from "@/@types/analytic"
import { Button } from "../ui/button";
import { ChartNoAxesCombined } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom";
interface Props {
   title: string;
   subtitle: string;
   dateRange?: DateRangeType;
   setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
   const location = useLocation()
   const navigate = useNavigate()

   return (
      <div className="flex flex-row items-start justify-between space-y-7">
         <div className="space-y-1 text-foreground">
            <h2 className="text-2xl lg:text-4xl font-medium ">{title}</h2>
            <p className=" text-sm">{subtitle}</p>
         </div>
         <div className="flex justify-end gap-4 mb-6">
            <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
            {location.pathname === "/overview" && (
               <Button
                  className="!cursor-pointer !text-white"
                  onClick={() => navigate("/analyse")}
               >
                  <ChartNoAxesCombined className="h-4 w-4" />
                  Analyse
               </Button>
            )}


         </div>
      </div>
   );
};

export default DashboardHeader;