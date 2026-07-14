"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loans_service_1 = require("./loans.service");
const auth_middleware_1 = require("../auth/auth.middleware");
const loans_middleware_1 = require("./loans.middleware");
const router = (0, express_1.Router)();
const loansService = new loans_service_1.LoansService();
router.use(auth_middleware_1.authenticateToken);
router.post("/", loans_middleware_1.authorizeLoanCreation, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autenticado" });
        const { bookId, documentType } = req.body;
        if (!documentType || typeof documentType !== "string" || documentType.trim() === "") {
            return res.status(400).json({ error: "Debe ingresar una identificación para continuar con el préstamo" });
        }
        const loan = await loansService.createLoan(req.user.userId, req.user.roleName, Number(bookId), documentType);
        return res.status(201).json(loan);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autenticado" });
        const loans = await loansService.findLoansForUser(req.user.userId, req.user.roleName);
        return res.json(loans);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/book/:bookId", async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autenticado" });
        const status = await loansService.getBookLoanStatus(Number(req.params.bookId));
        return res.json(status);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.get("/:id", loans_middleware_1.authorizeLoanDetail, async (req, res) => {
    try {
        const loan = await loansService.findLoanById(Number(req.params.id));
        return res.json(loan);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.patch("/:id/return", loans_middleware_1.authorizeLoanReturn, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autenticado" });
        const result = await loansService.returnLoan(Number(req.params.id), req.user.userId, req.user.roleName);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=loans.controller.js.map