import type { CreateTransactionType, UpdateTransactionType } from "../validators/transaction.validator.js"
import { calculateNextOccurrence } from "../utils/helper.js"
import TransactionModel, { TransactionTypeEnum } from "../model/transaction.model.js";
import { UnauthorizedException, NotFoundException, BadRequestException } from "../utils/app-error.js";
import axios from "axios"
import { ai, genAIModel } from "../config/google-ai.config.js";
import { receiptPrompt } from "../utils/prompt.js";
import { createUserContent, createPartFromBase64 } from "@google/genai";   
export const createTransactionService = async (body: CreateTransactionType, UserId: string) => {
   let nextRecurringDate: Date | undefined
   const currentDate = new Date()
   if (body.isRecurring && body.recurringInterval) {
      const calculateDate = calculateNextOccurrence(
         body.date,
         body.recurringInterval
      );
      nextRecurringDate = calculateDate < currentDate ? calculateNextOccurrence(calculateDate, body.recurringInterval) : calculateDate
   }
   const transaction = await TransactionModel.create({
      ...body,
      userId: UserId,
      category: body.category,
      amount: Number(body.amount),
      isRecurring: body.isRecurring || false,
      recurringInterval: body.recurringInterval || null,
      nextRecurringDate,
      lastProcessed: null,
   })
   return transaction

}

export const getAllTransactionService = async (UserId: string, filters: {
   keyword?: string;
   type?: keyof typeof TransactionTypeEnum;
   recurringStatus?: "RECURRING" | "NON_RECURRING";
}, pagination: {
   pageSize: number;
   pageNumber: number
}) => {
   const transaction = await TransactionModel.findOne({ userId: UserId });
   if (transaction && !transaction.userId.equals(UserId)) {
      throw new UnauthorizedException("Unauthorized Access");
   }
   const { keyword, type, recurringStatus } = filters;

   const filterConditions: Record<string, any> = { userId: UserId };
   if (keyword) {
      filterConditions.$or = [
         { title: { $regex: keyword, $options: "i" } },
         { category: { $regex: keyword, $options: "i" } },
         // { date: { $regex: keyword, $options: "i" } },

      ];
   }
   if (type) {
      filterConditions.type = type
   }
   if (recurringStatus) {
      if (recurringStatus === "RECURRING") {
         filterConditions.isRecurring = true
      }
      else if (recurringStatus === "NON_RECURRING") {
         filterConditions.isRecurring = false
      }
   }


   const { pageNumber, pageSize } = pagination
   const skip = (pageNumber - 1) * pageSize;
   const [transations, totalCount] = await Promise.all([
      TransactionModel.find(filterConditions)
         .skip(skip)
         .limit(pageSize)
         .sort({ createdAt: -1 }),
      TransactionModel.countDocuments(filterConditions),
   ]);
   const totalPages = Math.ceil(totalCount / pageSize);

   return {
      transations,
      pagination: {
         pageSize,
         pageNumber,
         totalCount,
         totalPages,
         skip,
      },
   }

}

export const getTransactionByIdService = async (UserId: string, transactionId: string) => {
   const transaction = await TransactionModel.findOne({ userId: UserId, _id: transactionId });
   if (!transaction) throw new NotFoundException("Transaction not found")
   return transaction
}

export const duplicateTransactionService = async (UserId: string, transactionId: string) => {
   const transaction = await TransactionModel.findOne({ userId: UserId });
   if (transaction && !transaction.userId.equals(UserId)) {
      throw new UnauthorizedException("Unauthorized Access");
   }
   const existingTransaction = await TransactionModel.findById({ _id: transactionId })
   if (!existingTransaction) throw new NotFoundException("Transaction not found")
   const duplicated = await TransactionModel.create({
      ...existingTransaction.toObject(),
      _id: undefined,
      title: `Duplicate - ${existingTransaction.title}`,
      description: existingTransaction.description
         ? `${existingTransaction.description} (Duplicate)`
         : "Duplicated transaction",
      isRecurring: false,
      recurringInterval: undefined,
      nextRecurringDate: undefined,
      createdAt: undefined,
      updatedAt: undefined,
   });
   return duplicated
}


export const updateTransactionService = async (UserId: string, transactionId: string, body: Partial<UpdateTransactionType>) => {
   const existingTransaction = await TransactionModel.findOne({ userId: UserId, _id: transactionId });
   if (!existingTransaction) throw new NotFoundException("Transaction not found")

   const now = new Date();
   const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;

   const date =
      body.date !== undefined ? new Date(body.date) : existingTransaction.date;

   const recurringInterval =
      body.recurringInterval || existingTransaction.recurringInterval;

   let nextRecurringDate: Date | undefined;

   if (isRecurring && recurringInterval) {
      const calulatedDate = calculateNextOccurrence(date, recurringInterval);

      nextRecurringDate =
         calulatedDate < now
            ? calculateNextOccurrence(now, recurringInterval)
            : calulatedDate;
   }

   existingTransaction.set({
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.category && { category: body.category }),
      ...(body.type && { type: body.type }),
      ...(body.paymentMethod && { paymentMethod: body.paymentMethod }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      date,
      isRecurring,
      recurringInterval,
      nextRecurringDate,
   });

   await existingTransaction.save();

   return;
}

export const deleteTransactionService = async (UserId: string, transactionId: string) => {
   const existingTransaction = await TransactionModel.findByIdAndDelete({ userId: UserId, _id: transactionId });
   if (!existingTransaction) throw new NotFoundException("Transaction not found")
   return;
}

export const bulkDeleteTransactionService = async (UserId: string, transactionIds: string[]) => {
   const deleteResult = await TransactionModel.deleteMany({
      _id: { $in: transactionIds },
      userId: UserId
   })
   if (deleteResult.deletedCount === 0) {
      throw new NotFoundException("No transactions found to delete")
   }
   return {
      sucess: true,
      deletedCount: deleteResult.deletedCount,
   };

}



export const bulkTransactionService = async (UserId: string, transactions: CreateTransactionType[]) => {
   try {
      const transactionToCreate = transactions.map((tx) => ({
         insertOne: {
            document: {
               ...tx,
               userId: UserId,
               isRecurring: false,
               nextRecurringDate: null,
               recurringInterval: null,
               lastProcesses: null,
               createdAt: new Date(),
               updatedAt: new Date(),
            },
         },
      }));
      const result = await TransactionModel.bulkWrite(transactionToCreate, { ordered: true });
      return {
         insertedCount: result.insertedCount,
         success: true,
      }

   } catch (error) {
      return { error: "Bulk_insert transaction service unavailable" };
   }
}

export const scanReceiptService = async (file: Express.Multer.File | undefined) => {
   if (!file) throw new BadRequestException("could not process file ");
   try {
      if (!file.path) throw new BadRequestException("could not process file ");
      console.log(file.path)
      const imageData = await axios.get(file.path, { responseType: 'arraybuffer' });
      const base64Image = Buffer.from(imageData.data, 'binary').toString('base64');
      if (!base64Image) throw new BadRequestException("could not process file ");


      const result = await ai.models.generateContent({
         model: genAIModel,
         contents: [
            createUserContent([
               receiptPrompt,
               createPartFromBase64(base64Image, file.mimetype),]),
         ],
         config: {
            temperature: 0,
            topP: 1,
            responseMimeType: "application/json",
         },
      })
      const response = result.text
      const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

      if (!cleanedText)
         return {
            error: "Could not read reciept  content",
         };

      const data = JSON.parse(cleanedText);

      if (!data.amount || !data.date) {
         return { error: "Reciept missing required information" };
      }

      return {
         title: data.title || "Receipt",
         amount: data.amount,
         date: data.date,
         description: data.description,
         category: data.category,
         paymentMethod: data.paymentMethod,
         type: data.type,
         receiptUrl: file.path,
      }

   } catch (error) {
      return { error: "Reciept scanning  service unavailable" };
   }
}