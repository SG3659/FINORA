import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { createTransactionSchema, updateTransactionSchema, transactionIdSchema, bulkDeleteTransactionSchema, bulkTransactionSchema } from "../validators/transaction.validator.js";
import { createTransactionService, getAllTransactionService, getTransactionByIdService, updateTransactionService, deleteTransactionService, duplicateTransactionService, bulkDeleteTransactionService, bulkTransactionService, scanReceiptService } from "../services/transaction.service.js";
import { TransactionTypeEnum } from "../model/transaction.model.js";
export const createTransactionController = asyncHandler(
   async (req: Request, res: Response) => {
      const body = createTransactionSchema.parse(req.body)
      const UserId = req.auth._id;
      const result = await createTransactionService(body, UserId)

      return res.status(HTTPSTATUS.CREATED).json({ message: "Transaction created successfully", data: result })
   }
)


export const getAllTransactionController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      // const filters = {
      //    keyword: req.query.keyword as string | undefined,
      //    type: req.query.type as keyof typeof TransactionTypeEnum | undefined,
      //    recurringStatus: req.query.recurringStatus as | "RECURRING" | "NON_RECURRING" | undefined,
      // }

      const keyword = req.query.keyword as string | undefined;
      const type = req.query.type as keyof typeof TransactionTypeEnum | undefined;
      const recurringStatus = req.query.recurringStatus as | "RECURRING" | "NON_RECURRING" | undefined;
      const filters: {
         keyword?: string;
         type?: keyof typeof TransactionTypeEnum;
         recurringStatus?: "RECURRING" | "NON_RECURRING",
      } = {
         ...(keyword && { keyword }),
         ...(type && { type }),
         ...(recurringStatus && { recurringStatus }),
      };

      const pagination = {
         pageSize: parseInt(req.query.limit as string) || 20,// set the page limit 
         pageNumber: parseInt(req.query.page as string) || 1,
      }
      const result = await getAllTransactionService(UserId, filters, pagination)
      return res.status(HTTPSTATUS.OK).json({ message: "Transaction Fetch successfully", data: result })
   }
)


export const getAllTransactionByidController = asyncHandler(async (req: Request, res: Response) => {
   const UserId = req.auth?._id;
   const transactionId = transactionIdSchema.parse(req.params.id)
   const result = await getTransactionByIdService(UserId, transactionId)
   res.status(HTTPSTATUS.OK).json({ message: "Transaction fetched successfully", data: result })
})

export const duplicateTransactionController = asyncHandler(
   async (req: Request, res: Response) => {
      const UserId = req.auth?._id;
      const transactionId = transactionIdSchema.parse(req.params.id);

      const transaction = await duplicateTransactionService(
         UserId,
         transactionId
      );

      return res.status(HTTPSTATUS.OK).json({
         message: "Transaction duplicated successfully",
         data: transaction,
      });
   }
);
export const updateTransactionController = asyncHandler(async (req: Request, res: Response) => {
   const body = updateTransactionSchema.parse(req.body)
   const UserId = req.auth?._id;
   const transactionId = transactionIdSchema.parse(req.params.id)
   await updateTransactionService(UserId, transactionId, body)
   res.status(HTTPSTATUS.OK).json({ message: "Transaction update successfully" })
})

export const deleteTransactionController = asyncHandler(async (req: Request, res: Response) => {
   const UserId = req.auth?._id;
   const transactionId = transactionIdSchema.parse(req.params.id)
   await deleteTransactionService(UserId, transactionId)
   res.status(HTTPSTATUS.OK).json({ message: "Transaction delete successfully" })
})

export const bulkDeleteTransactionController = asyncHandler(async (req: Request, res: Response) => {
   const UserId = req.auth?._id;
   const { transactionIds } = bulkDeleteTransactionSchema.parse(req.body);
   const result = await bulkDeleteTransactionService(UserId, transactionIds)
   res.status(HTTPSTATUS.OK).json({ message: "Transactions deleted successfully", ...result })
})

export const bulkTransactionController = asyncHandler(async (req: Request, res: Response) => {
   const UserId = req.auth?._id;
   const { transactions } = bulkTransactionSchema.parse(req.body);

   const result = await bulkTransactionService(UserId, transactions);
   res.status(HTTPSTATUS.OK).json({ message: "Transactions inserted successfully", ...result })

})

export const scanReceiptController = asyncHandler(
   async (req: Request, res: Response) => {
      const file = req?.file;

      const result = await scanReceiptService(file);

      return res.status(HTTPSTATUS.OK).json({
         message: "Reciept scanned successfully",
         data: result,
      });
   }
);