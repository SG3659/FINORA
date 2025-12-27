import { Router } from "express"
import AuthMiddleware from "../middleware/auth.middleware.js"
import { getUserProfileController } from "../controllers/user.controller.js";

const userRouter = Router()
userRouter.get("/profile", AuthMiddleware, getUserProfileController)
export default userRouter
