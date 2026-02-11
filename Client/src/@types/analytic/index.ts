
export interface FilterParams {
   preset?: string;
   from?: string;
   to?: string;
}

interface PercentageChange {
   income: number;
   expenses: number;
   balance: number;
   prevPeriodFrom: string | null;
   prevPeriodTo: string | null;
}

interface PresetType {
   from: string;
   to: string;
   value: string;
   label: string;
}

export interface SummaryAnalyticsResponse {
   message: string;
   data: {
      availableBalance: number;
      totalIncome: number;
      totalExpenses: number;
      transactionCount: number;
      savingRate: {
         percentage: number;
         expenseRatio: number;
      };
      percentageChange: PercentageChange;
      preset: PresetType;
   };
}

export interface ChartAnalyticsResponse {
   message: string;
   data: {
      chartData: {
         date: string;
         income: number;
         expenses: number;
      }[];
      totalIncomeCount: number;
      totalExpenseCount: number;
      preset: PresetType;
   };
}

export interface ExpensePieChartBreakdownResponse {
   message: string;
   data: {
      totalSpent: number;
      breakdown: {
         name: string;
         value: number;
         percentage: number;
      }[];
      preset: PresetType;
   };
}


export const DateRangeEnum = {
   LAST_30_DAYS: "30days",
   LAST_MONTH: "lastMonth",
   LAST_3_MONTHS: "last3Months",
   LAST_YEAR: "lastYear",
   THIS_MONTH: "thisMonth",
   THIS_YEAR: "thisYear",
   ALL_TIME: "allTime",
   CUSTOM: "custom",
} as const;

export type DateRangeEnumType =
   (typeof DateRangeEnum)[keyof typeof DateRangeEnum];

export type DateRangeType = {
   from: Date | null;
   to: Date | null;
   value?: string;
   label: string;
} | null

export type DateRangePreset = {
  label: string;
  value: string;
  getRange: () => DateRangeType;
};

export interface DateRangeSelectProps {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  defaultRange?: DateRangeEnumType;
}
export interface PropsType {
   dateRange?: DateRangeType;
}