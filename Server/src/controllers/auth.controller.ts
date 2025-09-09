import { type Request, type Response } from "express"
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerService, loginService } from "../services/auth.service.js";
export const registerController = asyncHandler(
   async (req: Request, res: Response) => {
      const body = registerSchema.parse(req.body);
      const result = await registerService(body)
      return res.status(HTTPSTATUS.CREATED).json({
         message: "User registered successfully",
         data: result,
      });
   })


export const loginController = asyncHandler(async (req: Request, res: Response) => {
   const data = loginSchema.parse(req.body);
   const { user, accessToken, expiresAt, reportSetting } = await loginService(data)
   return res.status(HTTPSTATUS.OK).json({ message: "User logged in successfully", user, accessToken, expiresAt, reportSetting });
})


export const getProfile = asyncHandler(async (req: Request, res: Response) => {

   console.log(req.auth._id);

   return res.status(HTTPSTATUS.OK).json({ message: "User profile fetched successfully" })
})