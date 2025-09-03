import Mongoose from "mongoose";
import { Env } from "./env.config.js";
export const dbConnect = () => {

   Mongoose.connect(Env.MONGO_URI).then(() => {
      console.log("Database Connected")
   }).catch((error) => {
      console.log("Database Connection failed:", error)
   })
}
export { Env };

