import { Router } from "express"
import AuthMiddleware from "../middleware/auth.middleware.js"
import { registerController, loginController, getProfile, refreshTokenController } from "../controllers/auth.controller.js";
const authRouter = Router()
authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.post("/refresh", refreshTokenController)
authRouter.get("/profile", AuthMiddleware, getProfile)
export default authRouter