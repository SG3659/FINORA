import type { registerSchemaType, loginSchemaType, updatePasswordType } from "../validators/auth.validator.js"
import UserModel from "../model/user.model.js";
import OtpModel from "../model/otp.model.js";
import { UnauthorizedException, NotFoundException, InternalServerException } from "../utils/app-error.js";
import mongoose from "mongoose";
import ReportSettingModel, { ReportFrequencyEnum } from "../model/report-setting.model.js";
import TransactionModel from "../model/transaction.model.js";
import ReportModel from "../model/report.model.js";
import { calculateNextReportDate } from "../utils/helper.js"
import { accessJwtToken, refreshJwtToken } from "../utils/jwt.js"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Env } from "../config/env.config.js";
import { sendOtpEmail } from "../mailers/otp.mailer.js";
import { generateOtp } from "../utils/otp-generator.js";
import type { otpSchemaType } from "../validators/otp.validator.js";
import { any } from "zod";
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
   // const session = await mongoose.startSession();
   // try {
   //    await session.withTransaction(async () => {
   await OtpModel.findOneAndDelete({ email });

   const user = await UserModel.findOne({ email })
   if (!user) {
      throw new NotFoundException("User not found")
   }
   const isPasswordValid = await user.comparePassword(password);
   if (!isPasswordValid) throw new UnauthorizedException("Invalid password");
   const otp = generateOtp()

   await sendOtpEmail(email, otp);

   let otpRecord = await OtpModel.findOne({ email });
   if (otpRecord) {
      otpRecord.otp = otp;
      otpRecord.otp_expireAt = new Date(Date.now() + 10 * 60 * 1000);
      await otpRecord.save();
   } else {
      otpRecord = new OtpModel({
         email,
         otp,
         otp_expireAt: new Date(Date.now() + 10 * 60 * 1000)
      });
      await otpRecord.save();
   }
}
export const otpVerifyService = async (body: otpSchemaType) => {
   const { email, otp } = body;

   const otpRecord = await OtpModel.findOne({ email });
   if (!otpRecord) {
      throw new UnauthorizedException("Invalid email");
   }
   if (otpRecord.otp_expireAt < new Date()) {
      throw new UnauthorizedException("OTP has expired");
   }
   const isOtpValid = await otpRecord.compareOtp(otp);
   if (!isOtpValid) {
      throw new UnauthorizedException("Invalid OTP");
   }

   const user = await UserModel.findOne({ email });
   if (!user) {
      throw new NotFoundException("User not found");
   }

   const { refreshToken, accessToken, tokenExpiresAt, refreshExpiresAt } = await generateRefreshAndAccessToken(user.id);

   await OtpModel.findOneAndDelete({ email });


   const reportSetting = await ReportSettingModel.findOne(
      { userId: user.id },
      { _id: 1, frequency: 1, isEnabled: 1 }
   ).lean();

   return {
      user: user.omitPassword(),
      accessToken,
      refreshToken,
      expiresAt: tokenExpiresAt,
      refreshExpireAt: refreshExpiresAt,
      reportSetting
   };
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
      const { refreshToken, accessToken, tokenExpiresAt, refreshExpiresAt } = await generateRefreshAndAccessToken(user.id)
      return { accessToken: accessToken, newRefreshToken: refreshToken, tokenExpiresAt, refreshExpiresAt }

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
      const { refreshToken, refreshExpiresAt } = refreshJwtToken({ userId: user.id });
      const { accessToken, tokenExpiresAt } = accessJwtToken({ userId: user.id });
      user.resetToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { refreshToken, accessToken, tokenExpiresAt, refreshExpiresAt }
   }
   catch (error) {
      throw error;
   }
}

export const logoutService = async (userId: string) => {
   await UserModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: null } },
      { new: true }
   );
}

export const deleteAccountService = async (userId: string) => {
   const session = await mongoose.startSession();
   try {
      await session.withTransaction(async () => {
         // Delete all transactions for the user
         await TransactionModel.deleteMany({ userId }).session(session);

         // Delete all reports for the user
         await ReportModel.deleteMany({ userId }).session(session);

         // Delete report settings for the user
         await ReportSettingModel.deleteMany({ userId }).session(session);

         // Finally, delete the user
         await UserModel.findByIdAndDelete(userId).session(session);
      });
   } catch (error) {
      throw error;
   } finally {
      session.endSession();
   }
}

export const updatePasswordService = async (userId: string, body: updatePasswordType) => {
   const user = await UserModel.findById(userId).select("+password");
   if (!user) {
      throw new NotFoundException("User not found");
   }
   const isPasswordValid = await user.comparePassword(body.oldPassword);
   if (!isPasswordValid) throw new UnauthorizedException("Old password is incorrect");
   user.password = body.newPassword;
   await user.save({ validateBeforeSave: false });
}