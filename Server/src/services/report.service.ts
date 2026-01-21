import ReportModel from "../model/report.model.js";
import ReportSettingModel from "../model/report-setting.model.js";
import { UnauthorizedException, NotFoundException } from "../utils/app-error.js";
import type { UpdateReportSettingType } from "../validators/report.validator.js";
import { calculateNextReportDate, calculateSavingRate } from "../utils/helper.js"
import TransactionModel, { TransactionTypeEnum } from "../model/transaction.model.js";
import mongoose from "mongoose";
import { convertToRupee } from "../utils/format-currency.js";
import { format } from "date-fns";
import { ai, genAIModel } from "../config/google-ai.config.js";
import { reportInsightPrompt } from "../utils/prompt.js"
import generateInsightsAI from "../utils/ai-insights.js";
export const getAllReportService = async (UserId: string, pagination: {
   pageSize: number;
   pageNumber: number
}) => {
   const transaction = await ReportModel.findOne({ userId: UserId });
   if (transaction && !transaction.userId.equals(UserId)) {
      throw new UnauthorizedException("Unauthorized Access");
   }

   const userId: Record<string, any> = { userId: UserId };
   const { pageNumber, pageSize } = pagination
   const skip = (pageNumber - 1) * pageSize;
   const [report, totalCount] = await Promise.all([
      ReportModel.find({ userId: UserId })
         .skip(skip)
         .limit(pageSize)
         .sort({ createdAt: -1 }),
      ReportModel.countDocuments({ userId }),
   ])
   const totalPages = Math.ceil(totalCount / pageSize);
   return {
      report,
      pagination: {
         pageSize,
         pageNumber,
         totalCount,
         totalPages,
         skip,
      }
   }

}
export const updateReoprtService = async (UserId: string, body: UpdateReportSettingType) => {
   const existReportSetting = await ReportSettingModel.findOne({ userId: UserId });
   if (!existReportSetting) {
      throw new UnauthorizedException("Report Setting not found");
   }
   const { isEnabled } = body;
   let nextReportDate: Date | null = null;
   const existingReportSetting = await ReportSettingModel.findOne({
      userId: UserId,
   });
   if (!existingReportSetting)
      throw new NotFoundException("Report setting not found");

   if (isEnabled) {
      const currentNextReportDate = existingReportSetting.nextReportDate;
      const now = new Date();
      if (!currentNextReportDate || currentNextReportDate <= now) {
         nextReportDate = calculateNextReportDate(
            existingReportSetting.lastSentDate
         );
      } else {
         nextReportDate = currentNextReportDate;
      }
   }
   console.log(nextReportDate, "nextReportDate");
   existingReportSetting.set({
      ...body,
      nextReportDate,
   });
   await existingReportSetting.save();
}

export const genrateReportService = async (UserId: string,
   fromDate: Date,
   toDate: Date) => {

   const results = await TransactionModel.aggregate([
      {
         $match: {
            userId: new mongoose.Types.ObjectId(UserId),
            date: { $gte: fromDate, $lte: toDate }
         }
      },
      {
         $facet: {
            summary: [
               {
                  $group: {
                     _id: null,
                     totalIncome: {
                        $sum: {
                           $cond: [{ $eq: ["$type", TransactionTypeEnum.INCOME] }, { $abs: "$amount" }, 0]
                        }
                     },
                     totalExpense: {
                        $sum: {
                           $cond: [{ $eq: ["$type", TransactionTypeEnum.EXPENSE] }, { $abs: "$amount" }, 0]
                        }
                     }
                  }
               }
            ]
            ,
            categories: [
               {
                  $match: { type: TransactionTypeEnum.EXPENSE }
               },
               {
                  $group: {
                     _id: "$category",
                     total: { $sum: { $abs: "$amount" } }
                  }
               },
               {
                  $sort: { total: -1 }
               },
               {
                  $limit: 5
               }
            ]
         }
      },
      {
         $project: {
            totalIncome: {
               $arrayElemAt: ["$summary.totalIncome", 0],
            },
            totalExpenses: {
               $arrayElemAt: ["$summary.totalExpense", 0],
            },
            categories: 1,
         }
      }

   ])

   if (
      !results?.length ||
      (results[0]?.totalIncome === 0 && results[0]?.totalExpenses === 0)
   )
      return null;

   const {
      totalIncome = 0,
      totalExpenses = 0,
      categories = [],
   } = results[0] || {};

   console.log(results[0], "results");
   const byCategory = categories.reduce(
      (acc: any, { _id, total }: any) => {
         acc[_id] = {
            amount: convertToRupee(total),
            percentage:
               totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
         };
         return acc;
      },
      {} as Record<string, { amount: number; percentage: number }>
   );
   const availableBalance = totalIncome - totalExpenses;
   const savingsRate = calculateSavingRate(totalIncome, totalExpenses);
   const periodLabel = `${format(fromDate, "MMMM d")} - ${format(toDate, "d, yyyy")}`;
   const insights = await generateInsightsAI({
      totalIncome,
      totalExpenses,
      availableBalance,
      savingsRate,
      categories: byCategory,
      periodLabel: periodLabel,
   });


   return {
      period: periodLabel,
      summary: {
         income: Number(convertToRupee(totalIncome)),
         expenses: Number(convertToRupee(totalExpenses)),
         balance: Number(convertToRupee(availableBalance)),
         savingsRate: Number(savingsRate.toFixed(1)),
         topCategories: Object.entries(byCategory)?.map(([name, cat]: any) => ({
            name,
            amount: cat.amount,
            percent: cat.percentage,
         })),
      },
      insights,
   };
}