"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_service_1 = require("./reports.service");
const auth_middleware_1 = require("../auth/auth.middleware");
const reports_middleware_1 = require("./reports.middleware");
const router = (0, express_1.Router)();
const reportsService = new reports_service_1.ReportsService();
router.use(auth_middleware_1.authenticateToken, reports_middleware_1.authorizeReportsAccess);
router.get("/loans/monthly", async (_req, res) => {
    try {
        const report = await reportsService.loansMonthly();
        return res.json(report);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/books/top", async (_req, res) => {
    try {
        const report = await reportsService.booksTop();
        return res.json(report);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/users/active", async (_req, res) => {
    try {
        const report = await reportsService.usersActive();
        return res.json(report);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/loans/overdue", async (_req, res) => {
    try {
        const report = await reportsService.loansOverdue();
        return res.json(report);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=reports.controller.js.map