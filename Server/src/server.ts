import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import { dbConnect } from "./config/db.config.js"
import { Env } from "./config/db.config.js"
import cors from "cors"
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


app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!')
})

app.listen(Env.PORT, async () => {
   await dbConnect();
   console.log(`Server is running in ${Env.NODE_ENV} mode: http://localhost:${Env.PORT}`);
});
