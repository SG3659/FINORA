import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import { dbConnect } from "./config/db.config.js"
import { Env } from "./config/db.config.js"
import cors from "cors"
import { errorHandler } from "./middleware/errorHandler.middleware.js"
import { NotFoundException } from "./utils/app-error.js"
import authRouter from "./routes/auth.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
import reportRouter from "./routes/report.routes.js"
import { initializeCrons } from "./cron/index.js"
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
app.use("/api/v1/report", reportRouter)
app.use(errorHandler)
app.listen(Env.PORT, async () => {
   await dbConnect();
   // if (Env.NODE_ENV === "development") {
   //    await initializeCrons();
   // }
   console.log(`Server is running in ${Env.NODE_ENV} mode: http://localhost:${Env.PORT}`);
});