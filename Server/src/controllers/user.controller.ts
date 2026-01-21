import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { type Request, type Response } from "express";
import { HTTPSTATUS } from "../config/http.config.js";
import { getUserProfileService, updateUserProfileService } from "../services/user.service.js";
import { updateUserschema } from "../validators/user.validators.js";
export const getUserProfileController = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.auth._id;
   const user = await getUserProfileService(userId);
   return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      data: user,
   });
})
export const updateUserProfileController = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.auth._id;
   const body = req.body ? updateUserschema.parse(req.body) : {};
   const profilePics = req.file;
   const updateUser = await updateUserProfileService(userId, body, profilePics);
   return res.status(HTTPSTATUS.OK).json({
      message: "User updated successfully",
      data: updateUser,
   });
}
)