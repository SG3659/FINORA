
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