import { z } from 'zod';
export const otpValidator = z.object({
   email: z.string().email({
      message: "Invalid email format",
   }).trim(),
   otp: z.string().length(6, {
      message: "OTP must be 6 characters long",
   }).trim(),
   otp_expireAt: z.date().optional(),
});

export const otpSchema = otpValidator
export type otpSchemaType = z.infer<typeof otpValidator>;