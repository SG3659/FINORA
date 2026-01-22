import { type Request, type Response } from "express"
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { registerSchema, loginSchema, updatePasswordSchema } from "../validators/auth.validator.js";
import { otpSchema } from "../validators/otp.validator.js";
import { registerService, loginService, refereshTokenService, logoutService, deleteAccountService, updatePasswordService, otpVerifyService } from "../services/auth.service.js";
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
   await loginService(data)

   return res
      .status(HTTPSTATUS.OK)

      .json({ message: "User logged & email sent successfully" });
})
export const otpVerifyController = asyncHandler(async (req: Request, res: Response) => {
   const data = otpSchema.parse(req.body);
   const options: {
      httpOnly: boolean,
      secure: boolean,
      sameSite: "none"
   } = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   }
   const { accessToken,
      refreshToken,
      expiresAt,
      refreshExpireAt, user, reportSetting } = await otpVerifyService(data)
   return res
      .status(HTTPSTATUS.OK)
      .cookie("refresh", refreshToken, options)
      .cookie("access", accessToken, options)
      .json({
         message: "User logged in successfully", accessToken, refreshToken, expiresAt, refreshExpireAt, user, reportSetting
      });
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





export const logoutController = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.auth._id;
   await logoutService(userId);
   const options: {
      httpOnly: boolean,
      secure: boolean
   } = {
      httpOnly: true,
      secure: true
   }
   return res
      .status(HTTPSTATUS.OK)
      .clearCookie("refresh", options)
      .clearCookie("access", options)
      .json({ message: "User logged out successfully" })
})


export const deleteAccountController = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.auth._id;
   await deleteAccountService(userId)
   return res.status(HTTPSTATUS.OK).json({ message: "Account deleted successfully" })
})

export const updatePasswordController = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.auth._id;
   const body = updatePasswordSchema.parse(req.body);
   await updatePasswordService(userId, body)
   return res.status(HTTPSTATUS.OK).json({ message: "Password updated successfully" })
})