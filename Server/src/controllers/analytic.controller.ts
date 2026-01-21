import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import type { DateRangePreset } from "../enums/date-range.js";
import { chartAnalyticsService, expensePieChartBreakdownService, summaryAnalyticsService } from "../services/analytical.service.js";
export const summaryAnalyticsController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      const { preset, from, to } = req.query;
      const filter = {
         dateRangePreset: preset as DateRangePreset,
         customFrom: from ? new Date(from as string) : undefined,
         customTo: to ? new Date(to as string) : undefined,
      }
      const result = await summaryAnalyticsService(UserId, filter.customFrom, filter.customTo, filter.dateRangePreset);
      return res.status(HTTPSTATUS.OK).json({ message: "Summary analytics fetched successfully", data: result })
   }
)


export const chartAnalyticsController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      const { preset, from, to } = req.query;
      const filter = {
         dateRangePreset: preset as DateRangePreset,
         customFrom: from ? new Date(from as string) : undefined,
         customTo: to ? new Date(to as string) : undefined,
      }
      const result = await chartAnalyticsService(UserId, filter.customFrom, filter.customTo, filter.dateRangePreset);
      return res.status(HTTPSTATUS.OK).json({ message: "Summary analytics fetched successfully", data: result })
   }
)

export const expensePieChartBreakdownController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      const { preset, from, to } = req.query;
      const filter = {
         dateRangePreset: preset as DateRangePreset,
         customFrom: from ? new Date(from as string) : undefined,
         customTo: to ? new Date(to as string) : undefined,
      }
      const result = await expensePieChartBreakdownService(UserId, filter.customFrom, filter.customTo, filter.dateRangePreset);
      return res.status(HTTPSTATUS.OK).json({ message: "Summary analytics fetched successfully", data: result })
   }
)