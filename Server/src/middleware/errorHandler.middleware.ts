import { HTTPSTATUS } from "../config/http.config.js"
import type { ErrorRequestHandler } from "express"
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
   console.log("Error occured in path", req.path)
   if (err instanceof AppError) {
      return res.status(err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
         errorCode: err.errorCode,
      });
   }
   return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error ",
      error: err.message || "Unknown Server Error",
   })
}