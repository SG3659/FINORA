import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { Env } from "../config/env.config.js";
import { HTTPSTATUS } from "../config/http.config.js";
import User from "../model/user.model.js";

declare global {
   namespace Express {
      interface Request {
         auth?: any;
      }
   }
}
const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const token = req.header("Authorization");

      if (!token) {
         return res.status(401).json({ message: "Please login or Register." });
      }

      const tokenWithoutBearer = token.replace("Bearer ", "");

      const verified = jwt.verify(tokenWithoutBearer, Env.JWT_SECRET) as jwt.JwtPayload;
      const user = await User.findById(verified.userId).select("-password");

      req.auth = user;
      next();
   } catch (error) {

      return res
         .status(HTTPSTATUS.UNAUTHORIZED)
         .json({ message: "Token expired. Please log in again." });
   }
};

export default AuthMiddleware;