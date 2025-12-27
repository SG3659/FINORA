import type { registerSchemaType, loginSchemaType } from "../validators/auth.validator.js"
import UserModel from "../model/user.model.js";
import { UnauthorizedException, NotFoundException, InternalServerException } from "../utils/app-error.js";
import mongoose from "mongoose";
import ReportSettingModel, { ReportFrequencyEnum } from "../model/report-setting.model.js";
import { calculateNextReportDate } from "../utils/helper.js"
import { accessJwtToken, refreshJwtToken } from "../utils/jwt.js"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Env } from "../config/env.config.js";
export const registerService = async (body: registerSchemaType) => {
   const { email } = body

   const session = await mongoose.startSession();
   try {
      await session.withTransaction(async () => {
         const existingUser = await UserModel.findOne({ email }).session(session);
         if (existingUser) throw new UnauthorizedException("User already exists");

         const newUser = new UserModel({
            ...body,
         });

         await newUser.save({ session });

         const reportSetting = new ReportSettingModel({
            userId: newUser._id,
            frequency: ReportFrequencyEnum.MONTHLY,
            isEnabled: true,
            nextReportDate: calculateNextReportDate(),
            lastSentDate: null,
         });
         await reportSetting.save({ session });

         return { user: newUser.omitPassword() };
      });

   } catch (error) {
      throw error
   }
   finally {
      session.endSession();
   }
}

export const loginService = async (body: loginSchemaType) => {
   //  body -> data
   // username or email
   //find the user
   //password check
   //access and referesh token
   //send cookie
   const { email, password } = body
   const user = await UserModel.findOne({ email })
   if (!user) {
      throw new NotFoundException("User not found")
   }
   const isPasswordValid = await user.comparePassword(password);
   if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

   const { refreshTokenData, accessTokenData } = await generateRefreshAndAccessToken(user.id);
   const reportSetting = await ReportSettingModel.findOne(
      {
         userId: user.id,
      },
      { _id: 1, frequency: 1, isEnabled: 1 }
   ).lean();

   return {
      user: user.omitPassword(),
      access: accessTokenData,
      refresh: refreshTokenData,
      reportSetting,

   }
}

export const refereshTokenService = async (incomingRefreshToken: string) => {
   //veerify refresh token
   // 
   try {
      const decodedToken = jwt.verify(incomingRefreshToken, Env.JWT_REFRESH_SECRET) as JwtPayload;
      const user = await UserModel.findById(decodedToken?.userId).select("-password");
      if (!user) {
         throw new NotFoundException("User not found");
      }
      if (incomingRefreshToken !== user.resetToken) {
         throw new UnauthorizedException("refreshToken mismatch")
      }
      const { refreshTokenData, accessTokenData } = await generateRefreshAndAccessToken(user.id)
      return { accessToken: accessTokenData, newRefreshToken: refreshTokenData }

   } catch (error) {
      throw new InternalServerException("Could not refresh token")
   }

}
// generate refresh and access token
const generateRefreshAndAccessToken = async (userId: string) => {
   try {
      const user = await UserModel.findById(userId)
      if (!user) {
         throw new NotFoundException("User not found");
      }
      const refreshTokenData = refreshJwtToken({ userId: user.id });
      const accessTokenData = accessJwtToken({ userId: user.id });
      user.resetToken = refreshTokenData.refreshToken;
      await user.save({ validateBeforeSave: false });
      return { refreshTokenData, accessTokenData }
   }
   catch (error) {
      throw error;
   }
}