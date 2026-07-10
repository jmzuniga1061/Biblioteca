import { Router, Response } from "express";
import { ReportsService } from "./reports.service";
import { PrismaService } from "./prisma.service";
import { authenticateToken, AuthRequest } from "./auth.middleware";
import { authorizeReportsAccess } from "./reports.middleware";

const router = Router();

const prismaService = new PrismaService();
const reportsService = new ReportsService(prismaService);

router.use(authenticateToken, authorizeReportsAccess);

router.get("/loans/monthly", async (_req: AuthRequest, res: Response) => {
  try {
    const report = await reportsService.loansMonthly();
    return res.json(report);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/books/top", async (_req: AuthRequest, res: Response) => {
  try {
    const report = await reportsService.booksTop();
    return res.json(report);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/users/active", async (_req: AuthRequest, res: Response) => {
  try {
    const report = await reportsService.usersActive();
    return res.json(report);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/loans/overdue", async (_req: AuthRequest, res: Response) => {
  try {
    const report = await reportsService.loansOverdue();
    return res.json(report);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;