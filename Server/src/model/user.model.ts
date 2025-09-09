import mongoose, { Document } from "mongoose";
import { hashValue, comparedValue } from "../utils/bcrypt.js";
export interface IUser extends Document {
   name: string,
   email: string,
   password: string,
   profilePicture: string | null;
   createdAt: Date;
   updatedAt: Date;
   comparePassword: (password: string) => Promise<boolean>;
   omitPassword: () => Omit<IUser, "password">
}

const userSchema = new mongoose.Schema<IUser>({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
   },
   profilePicture: {
      type: String,
      default: null,
   },
   password: {
      type: String,
      select: true,
      required: true,
   },
},
   { timestamps: true }
)

userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      if (this.password) {
         this.password = await hashValue(this.password);
      }
   }
   next();
});

userSchema.methods.omitPassword = function (): Omit<IUser, "password"> {
   const userObject = this.toObject();
   delete userObject.password;
   return userObject;
};

userSchema.methods.comparePassword = async function (password: string) {
   return comparedValue(password, this.password);
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;