import apiClient from "@/api/rtkquery/apiClent";
import { GetAllReportResponse, UpdateReportSettingParams } from "@/@types/reportTpye";

const reportApi = apiClient.injectEndpoints({
   endpoints: (builder) => ({
      getAllReports: builder.query<GetAllReportResponse, { pageSize: number, pageNumber: number }>({
         query: (params) => {
            const {
               pageNumber = 1,
               pageSize = 10,
            } = params
            return {
               url: "/report/all",
               method: "GET",
               params: {
                  pageNumber,
                  pageSize,
               }
            }
         }
      }),
      updateReportSetting: builder.mutation<void, UpdateReportSettingParams>({
         query: (payload) => ({
            url: "/report/update-setting",
            method: "PUT",
            body: payload,
         }),
      })


   })
})

export const { useGetAllReportsQuery, useUpdateReportSettingMutation } = reportApi;

