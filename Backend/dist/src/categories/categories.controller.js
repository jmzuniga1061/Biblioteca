"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_service_1 = require("./categories.service");
const auth_middleware_1 = require("../auth/auth.middleware");
const authors_middleware_1 = require("../authors/authors.middleware");
const router = (0, express_1.Router)();
const categoriesService = new categories_service_1.CategoriesService();
router.get("/", async (_req, res) => {
    try {
        const categories = await categoriesService.findAll();
        return res.json(categories);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const category = await categoriesService.findById(categoryId);
        return res.json(category);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.post("/", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoriesService.createCategory(name, description);
        return res.status(201).json(category);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.put("/:id", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const updated = await categoriesService.updateCategory(categoryId, req.body);
        return res.json(updated);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.delete("/:id", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const result = await categoriesService.deleteCategory(categoryId);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=categories.controller.js.map