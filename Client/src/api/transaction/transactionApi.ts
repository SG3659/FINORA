import apiClient from "@/api/rtkquery/apiClent";

import { GetAllTransactionParams, GetAllTransactionResponse, CreateTransactionBody, UpdateTransactionPayload, GetSingleTransactionResponse, BulkImportTransactionPayload } from "@/@types/transaction/transactionTypes";

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
      duplicateTransaction: builder.mutation<void, string>({
         query: (id) => ({
            url: `/transaction/duplicate/${id}`,
            method: "PUT",
         }),
         invalidatesTags: ["transactions"],
      }),
      deleteTransaction: builder.mutation({
         query: (id) => (
            {
               url: `/transaction/delete/${id}`,
               method: "DELETE",
            }
         ),
         invalidatesTags: ["transactions", "analytics"],
      }),
      bulkDeleteTransaction: builder.mutation<void, string[]>({
         query: (transactionIds) => ({
            url: `/transaction/bulk-delete`,
            method: "DELETE",
            body: { transactionIds }
         }),
         invalidatesTags: ["transactions", "analytics"],
      }),
      createTransaction: builder.mutation<void, CreateTransactionBody>({
         query: (data) => ({
            url: `/transaction/create`,
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["transactions", "analytics"],
      }),
      updateTransaction: builder.mutation<void, UpdateTransactionPayload>({
         query: ({ id, transaction }) => ({
            url: `/transaction/update/${id}`,
            method: "PATCH",
            body: transaction
         }),
         invalidatesTags: ["transactions", "analytics"],
      }),
      getSingleTransaction: builder.query<GetSingleTransactionResponse, string>({
         query: (id) => ({
            url: `/transaction/${id}`,
            method: "GET",
         }),
      }),
      bulkImportTransaction: builder.mutation<void, BulkImportTransactionPayload>(
         {
            query: (body) => ({
               url: "/transaction/bulk-insert",
               method: "POST",
               body,
            }),
            invalidatesTags: ["transactions"],
         }
      ),
   })
})

export const { useGetAllTransactionsQuery, useDeleteTransactionMutation, useDuplicateTransactionMutation, useBulkDeleteTransactionMutation, useCreateTransactionMutation, useUpdateTransactionMutation, useGetSingleTransactionQuery, useBulkImportTransactionMutation } = transactionApi