"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authors_service_1 = require("./authors.service");
const auth_middleware_1 = require("./auth.middleware");
const authors_middleware_1 = require("./authors.middleware");
const router = (0, express_1.Router)();
const authorsService = new authors_service_1.AuthorsService();
router.get("/", auth_middleware_1.authenticateToken, async (_req, res) => {
    try {
        const authors = await authorsService.findAll();
        return res.json(authors);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/:id", auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const authorId = Number(req.params.id);
        const author = await authorsService.findById(authorId);
        return res.json(author);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.post("/", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const { name, biography } = req.body;
        const author = await authorsService.createAuthor(name, biography);
        return res.status(201).json(author);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.put("/:id", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const authorId = Number(req.params.id);
        const updated = await authorsService.updateAuthor(authorId, req.body);
        return res.json(updated);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.delete("/:id", auth_middleware_1.authenticateToken, authors_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const authorId = Number(req.params.id);
        const result = await authorsService.deleteAuthor(authorId);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=authors.controller.js.map