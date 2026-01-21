import type { ReportType } from "../@types/report.type.js";

export type ReportEmailParams = {
   email: string;
   username: string;
   report: ReportType;
   frequency: string;
};