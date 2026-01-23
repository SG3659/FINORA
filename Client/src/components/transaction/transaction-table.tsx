import { useState } from "react";
import DataTable from "./data-table";
import { useGetAllTransactionsQuery } from "@/api/transaction/transactionApi"
import { _TransactionType, FilterType } from "@/@types/transaction/transactionTypes";

const TransactionTable = (props: {
   pageSize?: number,
   isShowPagination?: boolean;

}) => {

   const [filter, setFilter] = useState<FilterType>({
      keyword: undefined,
      type: undefined,
      recurringStatus: undefined,
      pageNumber: 1,
      pageSize: props.pageSize || 10,
   })
   const { data, isFetching: isFetchingData, error } = useGetAllTransactionsQuery({
      keyword: filter.keyword,
      type: filter.type,
      recurringStatus: filter.recurringStatus,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
   });
   console.log("API Response:", data);
   console.log("API Error:", error);
   const transactions = data?.data?.transations || [];

   console.log("Transactions:", transactions)
   const pagination = {
      totalItems: data?.pagination?.totalCount || 0,
      totalPages: data?.pagination?.totalPages || 0,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
   };
   // console.log(pagination.pageNumber)

   const handleFilterChange = (filters: Record<string, string>) => {
      const { type, frequently } = filters;
      setFilter((prev) => ({
         ...prev,
         type: type as _TransactionType,
         recurringStatus: frequently as "RECURRING" | "NON_RECURRING",
      }));
   };

   const handlePageChange = (pageNumber: number) => {
      setFilter((prev) => ({ ...prev, pageNumber }));
   };

   const handlePageSizeChange = (pageSize: number) => {
      setFilter((prev) => ({ ...prev, pageSize }));
   };

   return (
      <DataTable
         isLoading={isFetchingData}
         isShowPagination={props.isShowPagination}
         data={transactions}
         pagination={pagination}
         filters={[
            {
               key: "type",
               label: "All Types",
               options: [
                  { value: _TransactionType.INCOME, label: "Income" },
                  { value: _TransactionType.EXPENSE, label: "Expense" },
               ],
            },
            {
               key: "frequently",
               label: "Frequently",
               options: [
                  { value: "RECURRING", label: "Recurring" },
                  { value: "NON_RECURRING", label: "Non-Recurring" },
               ],
            },
         ]}
         onPageChange={(pageNumber: number) => handlePageChange(pageNumber)}
         onPageSizeChange={(pageSize: number) => handlePageSizeChange(pageSize)}
         onFilterChange={(filters: Record<string, string>) => handleFilterChange(filters)}
      />
   )
}
export default TransactionTable
