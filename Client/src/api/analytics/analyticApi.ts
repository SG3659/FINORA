import apiClient from "@/api/rtkquery/apiClent";
import { ChartAnalyticsResponse, ExpensePieChartBreakdownResponse, FilterParams, SummaryAnalyticsResponse } from "@/@types/analytic";

export const analyticsApi = apiClient.injectEndpoints({
   endpoints: (builder) => ({
      summaryAnalytics: builder.query<SummaryAnalyticsResponse, FilterParams>({
         query: (params) => {
            const {
               preset = undefined,
               from = undefined,
               to = undefined
            } = params;
            return {
               url: "/analytics/summary",
               method: "GET",
               params: { preset, from, to }
            }
         },
         providesTags: ["analytics"],
      }),
      chartAnalytics: builder.query<ChartAnalyticsResponse, FilterParams>({
         query: (params) => {
            const {
               preset = undefined,
               from = undefined,
               to = undefined
            } = params;
            return {
               url: "/analytics/chart",
               method: "GET",
               params: { preset, from, to }
            }
         },
         providesTags: ["analytics"],
      }),
      expensePieChartBreakdown: builder.query<ExpensePieChartBreakdownResponse, FilterParams>({
         query: (params) => {
            const {
               preset = undefined,
               from = undefined,
               to = undefined
            } = params;
            return {
               url: "/analytics/expense-breakdown",
               method: "GET",
               params: { preset, from, to }
            }
         },
         providesTags: ["analytics"],
      }),
   }),
});

export const {
   useSummaryAnalyticsQuery,
   useChartAnalyticsQuery,
   useExpensePieChartBreakdownQuery,
} = analyticsApi;