export const generateOtp = (length: number = 6) => {
   const otp = Math.floor(100000 + Math.random() * 900000)
   return otp.toString();
}