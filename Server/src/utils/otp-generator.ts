export const generateOtp = (length: number = 6) => {
   const otp = Math.floor(Math.random() * 900000)
   return otp.toString();
}