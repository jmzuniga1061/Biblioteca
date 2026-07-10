"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_service_1 = require("./users.service");
const auth_middleware_1 = require("./auth.middleware");
const users_middleware_1 = require("./users.middleware");
const router = (0, express_1.Router)();
const usersService = new users_service_1.UsersService();
router.use(auth_middleware_1.authenticateToken);
router.get("/", users_middleware_1.authorizeAdmin, async (_req, res) => {
    try {
        const users = await usersService.findAll();
        return res.json(users);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/me", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" });
        }
        const profile = await usersService.findProfile(req.user.userId);
        return res.json(profile);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/:id", users_middleware_1.authorizeAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await usersService.findById(userId);
        return res.json(user);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.put("/:id", users_middleware_1.authorizeAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { name, email, password } = req.body;
        const user = await usersService.updateUser(userId, { name, email, password });
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.delete("/:id", users_middleware_1.authorizeAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const result = await usersService.deleteUser(userId);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.patch("/:id/role", users_middleware_1.authorizeAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { roleName } = req.body;
        const user = await usersService.changeUserRole(userId, roleName);
        return res.json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=users.controller.js.map