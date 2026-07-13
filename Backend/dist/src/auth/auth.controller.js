"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, roleName } = req.body;
        const token = await authService.register(name, email, password, roleName || "cliente");
        return res.status(201).json({ token });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        return res.json({ token });
    }
    catch (error) {
        return res.status(401).json({ error: error.message });
    }
});
router.post("/refresh-token", async (req, res) => {
    try {
        const { token } = req.body;
        const refreshedToken = await authService.refreshToken(token);
        return res.json({ token: refreshedToken });
    }
    catch (error) {
        return res.status(401).json({ error: error.message });
    }
});
router.post("/logout", async (_req, res) => {
    const result = await authService.logout();
    return res.json(result);
});
exports.default = router;
//# sourceMappingURL=auth.controller.js.map