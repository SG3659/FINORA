import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getAllReportService } from "../services/report.service.js";
import { updateReportSettingSchema } from "../validators/report.validator.js";
import { updateReoprtService, genrateReportService } from "../services/report.service.js";
export const getAllReposrtController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      const pagination = {
         pageSize: parseInt(req.query.limit as string) || 20,// set the page limit
         pageNumber: parseInt(req.query.page as string) || 1,
      }
      const result = await getAllReportService(UserId, pagination)
      return res.status(HTTPSTATUS.OK).json({ message: "Report Fetch successfully", data: result })
   }
)

export const updateReportSettingController = asyncHandler(async (req: Request, res: Response) => {
   const body = updateReportSettingSchema.parse(req.body)
   const UserId = req.auth?._id;
   await updateReoprtService(UserId, body)
   res.status(HTTPSTATUS.OK).json({ message: "Transaction update successfully" })
}
)

export const generateReportController = asyncHandler(async (req: Request, res: Response) => {
   const UserId = req.auth?._id;
   const { from, to } = req.query;
   const fromDate = new Date(from as string);
   const toDate = new Date(to as string);

   const result = await genrateReportService(UserId, fromDate, toDate);

   return res.status(HTTPSTATUS.OK).json({
      message: "Report generated successfully",
      result,
   });
}
)