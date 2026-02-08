import { useState } from "react";
import DataTable from "@/components/data-table";
import { useGetAllTransactionsQuery, useBulkDeleteTransactionMutation } from "@/api/transaction/transactionApi"
import { _TransactionType, FilterType } from "@/@types/transaction/transactionTypes";
import { transactionColumns } from "./column";
import useDebounce from "@/hook/use-debounce-search";
import { toast } from "sonner"
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

   const { debounceSearch, search, setSearch } = useDebounce(500);
   const { data, isFetching: isFetchingData } = useGetAllTransactionsQuery({
      keyword: debounceSearch,
      type: filter.type,
      recurringStatus: filter.recurringStatus,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
   });
   console.log("API Response:", data);
   // console.log("API Error:", error);
   const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
      useBulkDeleteTransactionMutation();
   const transactions = data?.transations || [];

   // console.log("Transactions:", transactions)
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
   const handleBulkDelete = async (ids: string[]) => {
      try {
         await bulkDeleteTransaction(ids).unwrap();
         toast.success("Transactions deleted successfully");
      } catch (error) {
         console.error("Failed to bulk delete transactions:", error);
      }
   }

   return (
      <DataTable
         isLoading={isFetchingData}
         isBulkDeleting={isBulkDeleting}
         columns={transactionColumns}
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
         onBulkDelete={handleBulkDelete}
         selection={true}
         searchPlaceholder="Search transactions..."
         setSearch={setSearch}
         search={search}
         showSearch={true}
      />
   )
}
export default TransactionTable
