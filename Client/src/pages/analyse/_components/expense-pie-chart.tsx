/* eslint-disable react-hooks/static-components */
import { Label, Pie, PieChart, Cell } from "recharts";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   ChartConfig,
   ChartContainer,
   ChartLegend,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/@types/analytic";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/api/analytics/analyticApi";
import PieChartSkeleton from "./pieSkeleton"
const COLORS = [
   "var(--color-chart-1)",
   "var(--color-chart-2)",
   "var(--color-chart-3)",
   "var(--color-chart-4)",
];

// Create chart config for shadcn UI chart
const chartConfig = {
   amount: {
      label: "Amount",
   },
} satisfies ChartConfig;

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
   const { dateRange } = props;

   const { data, isFetching } = useExpensePieChartBreakdownQuery({
      preset: dateRange?.value,
   });
   const categories = data?.data?.breakdown || [];
   const totalSpent = data?.data?.totalSpent || 0;

   if (isFetching) {
      return <PieChartSkeleton />;
   }
   const CustomLegend = () => {
      return (
         <div className="grid grid-cols-1 gap-x-4 gap-y-2 mt-4">
            {categories.map((entry, index) => (
               <div key={`legend-${index}`} className="flex items-center gap-2">
                  <div
                     className="h-3 w-3 rounded-full"
                     style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="flex justify-between w-full">
                     <span className="text-xs font-medium truncate capitalize">
                        {entry.name}
                     </span>
                     <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                           {formatCurrency(entry.value)}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                           ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
                        </span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      );
   };


   return (
      <Card className="!shadow-none border-1 border-gray-100 dark:border-border">
         <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expenses Breakdown</CardTitle>
            <CardDescription>Total expenses {dateRange?.label}</CardDescription>
         </CardHeader>
         <CardContent className="h-[313px]">
            <div className=" w-full">
               {categories?.length === 0 ? (
                  <EmptyState
                     title="No expenses found"
                     description="There are no expenses recorded for this period."
                  />
               ) : (
                  <ChartContainer
                     config={chartConfig}
                     className="mx-auto aspect-square h-[300px]"
                  >
                     <PieChart >
                        <ChartTooltip
                           cursor={false}
                           content={<ChartTooltipContent />}
                        />

                        <Pie
                           data={categories}
                           dataKey="value"
                           nameKey="name"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={2}
                           strokeWidth={2}
                           stroke="#fff"
                        >
                           {categories.map((_, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}

                           <Label
                              content={({ viewBox }) => {
                                 if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                       <text
                                          x={viewBox.cx}
                                          y={viewBox.cy}
                                          textAnchor="middle"
                                          dominantBaseline="middle"
                                       >
                                          <tspan
                                             x={viewBox.cx}
                                             y={viewBox.cy}
                                             className="fill-foreground text-2xl font-bold"
                                          >
                                             ${totalSpent.toLocaleString()}
                                          </tspan>
                                          <tspan
                                             x={viewBox.cx}
                                             y={(viewBox.cy || 0) + 20}
                                             className="fill-muted-foreground text-xs"
                                          >
                                             Total Spent
                                          </tspan>
                                       </text>
                                    );
                                 }
                              }}
                           />
                        </Pie>
                        <ChartLegend content={<CustomLegend />} />
                     </PieChart>
                  </ChartContainer>
               )}
            </div>
         </CardContent>
      </Card>
   );
};



export default ExpensePieChart;