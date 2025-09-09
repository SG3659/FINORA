import { startOfMonth, addMonths } from "date-fns"
export function calulateNextReportDate(lastSentDate?: Date): Date {
   const now = new Date();
   const lastSent = lastSentDate || now;

   const nextDate = startOfMonth(addMonths(lastSent, 3));
   nextDate.setHours(0, 0, 0, 0);

   // console.log(nextDate, "nextDate");
   return nextDate;
}