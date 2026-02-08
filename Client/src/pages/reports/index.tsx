import {
   Card,
   CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "../reports/_components/schedule-report-drawer";
import ReportTable from "./_components/report-table";


export default function Reports() {

   return (
      <PageLayout
         title="Report History"
         subtitle="View and manage your financial reports"
         addMarginTop
         rightAction={
            <ScheduleReportDrawer />
         }
      >
         <Card className="border shadow-none">
            <CardContent>
               <ReportTable />
            </CardContent>
         </Card>
      </PageLayout>
   );
}