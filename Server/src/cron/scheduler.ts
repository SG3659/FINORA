import cron from "node-cron"
import { processRecurringTransactions } from "./jobs/transaction.cron.js";
import { processReportJob } from "./jobs/report.crom.js";
const scheduleJob = (name: string, time: string, job: Function) => {
   console.log(`Scheduling ${name} at ${time}`);

   return cron.schedule(
      time,
      async () => {
         try {
            await job();
            console.log(`${name} completed`);
         } catch (error) {
            console.log(`${name} failed`, error);
         }
      },
      {
         timezone: "UTC",
      }
   );
};


export const startJobs = () => {
   return [
      // run every  5 minutes   
      // scheduleJob("Transcation", "*5 0 * * *", processRecurringTransactions)
      scheduleJob("Reports", "*/1 * * * *", processReportJob),
   ]
}