import { HTTPSTATUS } from "../config/http.config.js"
import type { ErrorRequestHandler, Response } from "express"
import { AppError } from "../utils/app-error.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import { z, ZodError } from "zod";
import { MulterError } from "multer";


const formatZodError = (res: Response, error: z.ZodError) => {
   const errors = error?.issues?.map((err) => ({
      field: err.path.join("."),
      message: err.message,
   }));
   return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Validation failed",
      errors: errors,
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
   });
};

const multerErrorHandler = (res: Response, error: MulterError) => {
   const message = {
      LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
      LIMIT_FILE_SIZE: "File size exceeds the limit",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      default: "File upload error",
   }
   return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: message[error.code as keyof typeof message] || message.default,
      errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR,
      error: error.message,
   })
}


export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
   console.log("Error occured in path", req.path, "Error", err)
   if (err instanceof ZodError) {
      return formatZodError(res, err)
   }
   if (err instanceof MulterError) {
      return multerErrorHandler(res, err)
   }

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