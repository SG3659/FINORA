import apiClient from "@/api/rtkquery/apiClent";

import { GetAllTransactionParams, GetAllTransactionResponse } from "@/@types/transaction/transactionTypes";

const transactionApi = apiClient.injectEndpoints({
   endpoints: (builder) => ({
      getAllTransactions: builder.query<GetAllTransactionResponse, GetAllTransactionParams>({
         query: (params) => {
            const {
               keyword = undefined,
               type = undefined,
               recurringStatus = undefined,
               pageNumber = 1,
               pageSize = 10,
            } = params;

            return {
               url: "/transaction/all",
               method: "GET",
               params: {
                  keyword,
                  type,
                  recurringStatus,
                  pageNumber,
                  pageSize,
               },
            };
         },
         providesTags: ["transactions"],
      }),
   })
})

export const { useGetAllTransactionsQuery } = transactionApi