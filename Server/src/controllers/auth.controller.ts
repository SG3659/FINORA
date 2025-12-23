import { type Request, type Response } from "express"
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerService, loginService, refereshTokenService } from "../services/auth.service.js";
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
   const { user, access, refresh, reportSetting } = await loginService(data)

   return res
      .status(HTTPSTATUS.OK)
      .cookie("refresh", refresh, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 })
      .json({ message: "User logged in successfully", user, access, refresh, reportSetting });
})

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
   const refreshToken = req.cookies?.refresh;
   if (!refreshToken) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "No refresh token provided" });
   }
   const { accessToken, newRefreshToken } = await refereshTokenService(refreshToken);
   return res
      .status(HTTPSTATUS.OK)
      .cookie("refresh", newRefreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 })
      .json({ message: "Refresh token successfully", accessToken });
})



export const getProfile = asyncHandler(async (req: Request, res: Response) => {

   console.log(req.auth._id);

   return res.status(HTTPSTATUS.OK).json({ message: "User profile fetched successfully" })
})