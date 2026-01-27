/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";



type PaymentMethodType =
  (typeof _PaymentMethodsEnum)[keyof typeof _PaymentMethodsEnum];

export const Categories = [
   { value: "groceries", label: "Groceries" },
   { value: "dining", label: "Dining & Restaurants" },
   { value: "transportation", label: "Transportation" },
   { value: "utilities", label: "Utilities" },
   { value: "entertainment", label: "Entertainment" },
   { value: "shopping", label: "Shopping" },
   { value: "healthcare", label: "Healthcare" },
   { value: "travel", label: "Travel" },
   { value: "housing", label: "Housing & Rent" },
   { value: "income", label: "Income" },
   { value: "investments", label: "Investments" },
   { value: "other", label: "Other" },
];
export const _TransactionType = {
   INCOME: "INCOME",
   EXPENSE: "EXPENSE"
}
export type _TransactionType = keyof typeof _TransactionType

export type FilterType = {
   keyword: string | undefined;
   type?: _TransactionType | undefined;
   recurringStatus?: "RECURRING" | "NON_RECURRING" | undefined;
   pageNumber?: number;
   pageSize?: number;
}
export const _TransactionFrequency = {
   DAILY: "DAILY",
   WEEKLY: "WEEKLY",
   MONTHLY: "MONTHLY",
   YEARLY: "YEARLY"
}


export const _PaymentMethodsEnum = {
   CARD: "CARD",
   BANK_TRANSFER: "BANK_TRANSFER",
   MOBILE_PAYMENT: "MOBILE_PAYMENT",
   CASH: "CASH",
   AUTO_DEBIT: "AUTO_DEBIT",
   OTHER: "OTHER",
} as const;

export const PaymentMethods = [
   { value: _PaymentMethodsEnum.CARD, label: "Credit/Debit Card" },
   { value: _PaymentMethodsEnum.CASH, label: "Cash" },
   { value: _PaymentMethodsEnum.BANK_TRANSFER, label: "Bank Transfer" },
   { value: _PaymentMethodsEnum.MOBILE_PAYMENT, label: "Mobile Payment" },
   { value: _PaymentMethodsEnum.AUTO_DEBIT, label: "Auto Debit" },
   { value: _PaymentMethodsEnum.OTHER, label: "Other" },
];

export type RecurringIntervalType = keyof typeof _TransactionFrequency


export interface TransactionType {
   _id: string;
   userId: string;
   title: string;
   type: _TransactionType;
   amount: number;
   description: string;
   category: string;
   date: string;
   isRecurring: boolean;
   recurringInterval: RecurringIntervalType | null;
   nextRecurringDate: string | null;
   lastProcessed: string | null;
   status: string;
   paymentMethod: string;
   createdAt: string;
   updatedAt: string;
   id?: string;
}
export interface GetAllTransactionParams {
   keyword?: string;
   type?: _TransactionType;
   recurringStatus?: "RECURRING" | "NON_RECURRING";
   pageNumber?: number;
   pageSize?: number;
}
export interface GetAllTransactionResponse {
   message: string;
   transations: TransactionType[];
   pagination: {
      pageSize: number;
      pageNumber: number;
      totalCount: number;
      totalPages: number;
      skip: number;
   };
}

export interface FilterOption {
   key: string;
   label: string;
   options: { value: string; label: string }[];
}

export interface DataTableProps<TData> {
   data: TData[];
   columns: ColumnDef<TData, any>[];
   filters?: FilterOption[];
   isLoading?: boolean;
   isBulkDeleting?: boolean;
   isShowPagination?: boolean;
   selection: boolean;
   showSearch: boolean;
   className?: string;
   searchPlaceholder?: string;
   setSearch?: (value: string) => void;
   search?: string;
   pagination?: {
      totalItems?: number;
      totalPages?: number;
      pageNumber?: number;
      pageSize?: number;
   };
   onPageChange?: (pageNumber: number) => void;
   onPageSizeChange?: (pageSize: number) => void;
   onFilterChange?: (filters: Record<string, string>) => void;
   onBulkDelete?: (ids: string[]) => void;
}

export interface DataTablePaginationProps {
   pageNumber: number;
   pageSize: number;
   totalCount: number; // Total rows from the API
   totalPages: number;
   onPageChange?: (page: number) => void;
   onPageSizeChange?: (size: number) => void;
}

export interface EmptyStateProps {
   icon?: LucideIcon;
   title: string;
   description: string;
   className?: string;
}

export interface CreateTransactionBody {
   title: string;
   type: _TransactionType;
   amount: number;
   description: string;
   category: string;
   date: string;
   isRecurring: boolean;
   recurringInterval: RecurringIntervalType | null;
   paymentMethod: string;
}

export interface UpdateTransactionPayload {
   id: string;
   transaction: CreateTransactionBody;
}

export interface GetSingleTransactionResponse {
   message: string;
   transaction: TransactionType;
}


export const MAX_IMPORT_LIMIT = 300;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export type CsvColumn = {
   id: string;
   name: string;
   sampleData: string;
   hasError?: boolean;
};

export type TransactionField = {
   fieldName: string;
   required: boolean;
   description?: string;
};



export interface BulkTransactionType {
  title: string;
  type: _TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethodType;
  isRecurring: boolean;
}

export interface BulkImportTransactionPayload {
  transactions: BulkTransactionType[];
}