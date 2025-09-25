import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import { dbConnect } from "./config/db.config.js"
import { Env } from "./config/db.config.js"
import cors from "cors"
import { errorHandler } from "./middleware/errorHandler.middleware.js"
import { NotFoundException } from "./utils/app-error.js"
import authRouter from "./routes/auth.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(
   cors({
      origin: Env.FRONTEND_ORIGIN,
      credentials: true,
   })
);
app.use("/api/v1", authRouter)
app.use("/api/v1/transaction", transactionRouter)
app.use(errorHandler)
app.listen(Env.PORT, async () => {
   await dbConnect();
   console.log(`Server is running in ${Env.NODE_ENV} mode: http://localhost:${Env.PORT}`);
});
