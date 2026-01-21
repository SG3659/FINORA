import mongoose, { Document } from "mongoose";
import { hashValue, comparedValue } from "../utils/bcrypt.js";
export interface OtpDocument extends Document {
   email: string,
   otp: string,
   otp_expireAt: Date,
   compareOtp: (otp: string) => Promise<boolean>;
}

const otpSchema = new mongoose.Schema<OtpDocument>({
   email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
   },
   otp: {
      type: String,
      required: true,
   },
   otp_expireAt: {
      type: Date,
      required: true,
   }
})

otpSchema.pre("save", async function (next) {
   if (this.isModified("otp")) {
      if (this.otp.toString()) {
         this.otp = await hashValue(this.otp);
      }
   }
   next();
});

otpSchema.methods.compareOtp = async function (otp: string) {
   return comparedValue(otp, this.otp);
}

const OtpModel = mongoose.model<OtpDocument>("Otp", otpSchema);
export default OtpModel;