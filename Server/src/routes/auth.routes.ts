import { Router } from "express"
import AuthMiddleware from "../middleware/auth.middleware.js"
import { registerController, loginController, refreshTokenController, logoutController, deleteAccountController, updatePasswordController, otpVerifyController } from "../controllers/auth.controller.js";
const authRouter = Router()
authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.post("/otp-verify", otpVerifyController)
authRouter.post("/refresh", refreshTokenController)
authRouter.post("/logout", AuthMiddleware, logoutController)
authRouter.delete("/delete-account", AuthMiddleware, deleteAccountController)
authRouter.put("/update-password", AuthMiddleware, updatePasswordController)
export default authRouter