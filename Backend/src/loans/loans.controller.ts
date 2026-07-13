import { Router, Response } from "express";
import { LoansService } from "./loans.service";
import { authenticateToken, AuthRequest } from "../auth/auth.middleware";
import { authorizeLoanCreation, authorizeLoanDetail, authorizeLoanReturn } from "./loans.middleware";

const router = Router();
const loansService = new LoansService();

router.use(authenticateToken);

router.post("/", authorizeLoanCreation, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    const { bookId, documentType } = req.body;
    const loan = await loansService.createLoan(req.user.userId, req.user.roleName, Number(bookId), documentType);
    return res.status(201).json(loan);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    const loans = await loansService.findLoansForUser(req.user.userId, req.user.roleName);
    return res.json(loans);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/book/:bookId", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    const status = await loansService.getBookLoanStatus(Number(req.params.bookId));
    return res.json(status);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.get("/:id", authorizeLoanDetail, async (req: AuthRequest, res: Response) => {
  try {
    const loan = await loansService.findLoanById(Number(req.params.id));
    return res.json(loan);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
});

router.patch("/:id/return", authorizeLoanReturn, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    const result = await loansService.returnLoan(Number(req.params.id), req.user.userId, req.user.roleName);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
