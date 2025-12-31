import { Router } from "express"
import AuthMiddleware from "../middleware/auth.middleware.js"
import { getUserProfileController, updateUserProfileController } from "../controllers/user.controller.js";

const userRouter = Router()
userRouter.get("/profile", AuthMiddleware, getUserProfileController)
userRouter.put("/profile", AuthMiddleware, updateUserProfileController)
export default userRouter
