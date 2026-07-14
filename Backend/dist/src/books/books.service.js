"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
class BooksService {
    async findAll() {
        return prisma_1.default.book.findMany({
            include: {
                author: true,
                category: true,
            },
        });
    }
    async findById(bookId) {
        const book = await prisma_1.default.book.findUnique({
            where: { id: bookId },
            include: { author: true, category: true },
        });
        if (!book) {
            throw new Error("Libro no encontrado");
        }
        return book;
    }
    async createBook(data) {
        const author = await prisma_1.default.author.findUnique({ where: { id: data.authorId } });
        if (!author) {
            throw new Error("Autor no encontrado");
        }
        const category = await prisma_1.default.category.findUnique({ where: { id: data.categoryId } });
        if (!category) {
            throw new Error("Categoría no encontrada");
        }
        return prisma_1.default.book.create({
            data: {
                title: data.title,
                isbn: data.isbn,
                description: data.description,
                editorial: data.editorial,
                stock: data.stock ?? 1,
                available: data.available ?? true,
                imageUrl: data.imageUrl,
                year: data.year,
                authorId: data.authorId,
                categoryId: data.categoryId,
            },
            include: { author: true, category: true },
        });
    }
    async updateBook(bookId, data) {
        const book = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new Error("Libro no encontrado");
        }
        if (data.authorId) {
            const author = await prisma_1.default.author.findUnique({ where: { id: data.authorId } });
            if (!author) {
                throw new Error("Autor no encontrado");
            }
        }
        if (data.categoryId) {
            const category = await prisma_1.default.category.findUnique({ where: { id: data.categoryId } });
            if (!category) {
                throw new Error("Categoría no encontrada");
            }
        }
        return prisma_1.default.book.update({
            where: { id: bookId },
            data: {
                title: data.title,
                isbn: data.isbn,
                description: data.description,
                editorial: data.editorial,
                stock: data.stock,
                available: data.available,
                imageUrl: data.imageUrl,
                year: data.year,
                authorId: data.authorId,
                categoryId: data.categoryId,
            },
            include: { author: true, category: true },
        });
    }
    async deleteBook(bookId) {
        const book = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new Error("Libro no encontrado");
        }
        await prisma_1.default.book.delete({ where: { id: bookId } });
        return { message: "Libro eliminado" };
    }
    async searchBooks(query) {
        const normalized = query?.trim() ?? "";
        const where = normalized
            ? {
                OR: [
                    { title: { contains: normalized, mode: "insensitive" } },
                    { description: { contains: normalized, mode: "insensitive" } },
                    { isbn: { contains: normalized, mode: "insensitive" } },
                    { editorial: { contains: normalized, mode: "insensitive" } },
                    { year: { contains: normalized, mode: "insensitive" } },
                    { author: { name: { contains: normalized, mode: "insensitive" } } },
                    { category: { name: { contains: normalized, mode: "insensitive" } } },
                ],
            }
            : {};
        return prisma_1.default.book.findMany({
            where,
            include: { author: true, category: true },
        });
    }
}
exports.BooksService = BooksService;
//# sourceMappingURL=books.service.js.map