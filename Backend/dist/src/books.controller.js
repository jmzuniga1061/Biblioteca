"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_service_1 = require("./books.service");
const auth_middleware_1 = require("./auth.middleware");
const books_middleware_1 = require("./books.middleware");
const router = (0, express_1.Router)();
const booksService = new books_service_1.BooksService();
router.get("/", auth_middleware_1.authenticateToken, async (_req, res) => {
    try {
        const books = await booksService.findAll();
        return res.json(books);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/search", auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const books = await booksService.searchBooks(req.query.query);
        return res.json(books);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get("/:id", auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const book = await booksService.findById(bookId);
        return res.json(book);
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
});
router.post("/", auth_middleware_1.authenticateToken, books_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const created = await booksService.createBook(req.body);
        return res.status(201).json(created);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.put("/:id", auth_middleware_1.authenticateToken, books_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const updated = await booksService.updateBook(bookId, req.body);
        return res.json(updated);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.delete("/:id", auth_middleware_1.authenticateToken, books_middleware_1.authorizeBibliotecario, async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const result = await booksService.deleteBook(bookId);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=books.controller.js.map