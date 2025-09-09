import type { registerSchemaType, loginSchemaType } from "../validators/auth.validator.js"
import UserModel from "../model/user.model.js";
import { UnauthorizedException, NotFoundException } from "../utils/app-error.js";
import mongoose from "mongoose";
import ReportSettingModel, { ReportFrequencyEnum } from "../model/report-setting.model.js";
import { calulateNextReportDate } from "../utils/helper.js"
import { signJwtToken } from "../utils/jwt.js"
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
            nextReportDate: calulateNextReportDate(),
            lastSentDate: null,
         });
         await reportSetting.save({ session });

         return { user: newUser.omitPassword() };
      });

   } catch (error) {
      throw new NotFoundException("Registration failed");
   }
   finally {
      session.endSession();
   }
}

export const loginService = async (body: loginSchemaType) => {
   const { email, password } = body
   const user = await UserModel.findOne({ email })
   if (!user) {
      throw new NotFoundException("User not found")
   }
   const isPasswordValid = await user.comparePassword(password);
   if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

   const { token, expiresAt } = signJwtToken({ userId: user.id });
   const reportSetting = await ReportSettingModel.findOne(
      {
         userId: user.id,
      },
      { _id: 1, frequency: 1, isEnabled: 1 }
   ).lean();

   return {
      user: user.omitPassword(),
      accessToken: token,
      expiresAt,
      reportSetting,

   }

}