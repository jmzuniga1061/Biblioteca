"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeLoanCreation = authorizeLoanCreation;
exports.authorizeLoanDetail = authorizeLoanDetail;
exports.authorizeLoanReturn = authorizeLoanReturn;
const loans_service_1 = require("./loans.service");
const loansService = new loans_service_1.LoansService();
async function authorizeLoanCreation(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    const allowed = ["cliente", "estudiante", "profesor"];
    if (!allowed.includes(req.user.roleName)) {
        return res.status(403).json({ error: "No tienes permiso para crear préstamos" });
    }
    next();
}
async function authorizeLoanDetail(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    const loanId = Number(req.params.id);
    if (Number.isNaN(loanId)) {
        return res.status(400).json({ error: "ID de préstamo inválido" });
    }
    try {
        const loan = await loansService.findLoanById(loanId);
        if (req.user.roleName === "bibliotecario" || req.user.roleName === "admin" || loan.userId === req.user.userId) {
            return next();
        }
        return res.status(403).json({ error: "No tienes permiso para ver este préstamo" });
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
}
async function authorizeLoanReturn(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    const loanId = Number(req.params.id);
    if (Number.isNaN(loanId)) {
        return res.status(400).json({ error: "ID de préstamo inválido" });
    }
    try {
        const loan = await loansService.findLoanById(loanId);
        if (req.user.roleName === "bibliotecario") {
            return next();
        }
        if (loan.userId !== req.user.userId) {
            return res.status(403).json({ error: "Solo puedes devolver tus propios préstamos" });
        }
        return next();
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
}
//# sourceMappingURL=loans.middleware.js.map