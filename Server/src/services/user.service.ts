import UserModel from "../model/user.model.js";
import { NotFoundException } from "../utils/app-error.js";
import type { updateProfileType } from "../validators/user.validators.js";

export const getUserProfileService = async (userId: string) => {
   const user = await UserModel.findById(userId);
   if (!user) {
      throw new NotFoundException("User not found");
   }

   return user?.omitPassword();
}

export const updateUserProfileService = async (userId: string, body: updateProfileType, profilePics?: Express.Multer.File) => {
   const user = await UserModel.findById(userId);
   if (!user) {
      throw new NotFoundException("User not found");
   }
   if(profilePics){
      user.profilePicture= profilePics.path;
   }
   user.set({
      name: body.name
   })
   await user.save();
   return user.omitPassword();
}