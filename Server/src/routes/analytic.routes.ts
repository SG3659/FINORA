import { summaryAnalyticsController, chartAnalyticsController } from "../controllers/analytic.controller.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
const analyticsRoutes = Router();
analyticsRoutes.get("/summary", AuthMiddleware, summaryAnalyticsController);
analyticsRoutes.get("/chart", AuthMiddleware, chartAnalyticsController);
export default analyticsRoutes;