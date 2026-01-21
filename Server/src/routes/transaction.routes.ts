import { Router } from "express"
import AuthMiddleware from "../middleware/auth.middleware.js"
import { createTransactionController, getAllTransactionController, getAllTransactionByidController, updateTransactionController, deleteTransactionController, duplicateTransactionController, bulkDeleteTransactionController, bulkTransactionController, scanReceiptController } from "../controllers/transaction.controller.js"
import { upload } from "../config/cloudnary.config.js"
const transactionRouter = Router()



transactionRouter.post("/create", AuthMiddleware, createTransactionController);
transactionRouter.post(
   "/scan-receipt",
   upload.single("receipt"),
   scanReceiptController
);
transactionRouter.get("/all", AuthMiddleware, getAllTransactionController);
transactionRouter.get("/:id", AuthMiddleware, getAllTransactionByidController);
transactionRouter.put("/duplicate/:id", AuthMiddleware, duplicateTransactionController);
transactionRouter.patch("/update/:id", AuthMiddleware, updateTransactionController);
transactionRouter.delete("/delete/:id", AuthMiddleware, deleteTransactionController);
transactionRouter.delete("/bulk-delete", AuthMiddleware, bulkDeleteTransactionController);
transactionRouter.post("/bulk-insert", AuthMiddleware, bulkTransactionController);
export default transactionRouter;
