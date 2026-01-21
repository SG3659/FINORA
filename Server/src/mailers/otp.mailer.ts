import { sendEmail } from "./mailer.js"
import { otpTemplate } from "./templates/otp.template.js";
export const sendOtpEmail = (email: string, otp: string) => {

   const html = otpTemplate(otp)
   return sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html,
   });
}