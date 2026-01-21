import { ai, genAIModel } from "../config/google-ai.config.js";
import { convertToRupee } from "./format-currency.js";
import { reportInsightPrompt } from "./prompt.js";
import { createUserContent } from "@google/genai"
async function generateInsightsAI({
   totalIncome,
   totalExpenses,
   availableBalance,
   savingsRate,
   categories,
   periodLabel
}: {
   totalIncome: number;
   totalExpenses: number;
   availableBalance: number;
   savingsRate: number;
   categories: Record<string, { amount: number; percentage: number }>;
   periodLabel: string;
}) {
   try {
      const prompt = reportInsightPrompt({
         totalIncome: Number(convertToRupee(totalIncome)),
         totalExpenses: Number(convertToRupee(totalExpenses)),
         availableBalance: Number(convertToRupee(availableBalance)),
         savingsRate: Number(savingsRate.toFixed(1)),
         categories,
         periodLabel,
      });
      const result = await ai.models.generateContent({
         model: genAIModel,
         contents: [createUserContent([prompt])],
         config: {
            responseMimeType: "application/json",
         },
      });

      const response = result.text;
      console.log(response)
      const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

      if (!cleanedText) return [];

      const data = JSON.parse(cleanedText);
      return data;

   } catch (error) {
      return [];
   }
}
export default generateInsightsAI;