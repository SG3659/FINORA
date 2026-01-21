import { startOfMonth, addMonths, setHours, addDays, addWeeks, addYears } from "date-fns"
import { RecurringIntervalEnum } from "../model/transaction.model.js";
export function calculateNextOccurrence(date: Date, recurringInterval: keyof typeof RecurringIntervalEnum) {
   const base = new Date(date);
   base.setHours(0, 0, 0, 0);
   switch (recurringInterval) {
      case RecurringIntervalEnum.DAILY:
         return addDays(base, 1);
      case RecurringIntervalEnum.WEEKLY:
         return addWeeks(base, 1);
      case RecurringIntervalEnum.MONTHLY:
         return addMonths(base, 1);
      case RecurringIntervalEnum.YEARLY:
         return addYears(base, 1);
      default:
         return base;
   }
}
export function calculateNextReportDate(lastSentDate?: Date): Date {
   const now = new Date();
   const lastSent = lastSentDate || now;

   const nextDate = startOfMonth(addMonths(lastSent, 1));
   nextDate.setHours(0, 0, 0, 0);

   // console.log(nextDate, "nextDate");
   return nextDate;
}
export function capitalizeFirstLetter(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function calculateSavingRate(totalIncome: number, totalExpenses: number) {
   if (totalIncome <= 0) return 0;
   const savingRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
   return parseFloat(savingRate.toFixed(2));
}



export function calaulatePercentageChange(previous: number, current: number) {
   if (previous === 0) return current === 0 ? 0 : 100;
   const changes = ((current - previous) / Math.abs(previous)) * 100;
   const cappedChange = Math.min(Math.max(changes, -100), 100);
   return parseFloat(cappedChange.toFixed(2));
}