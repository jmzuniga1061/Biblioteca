"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorsService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
class AuthorsService {
    async findAll() {
        return prisma_1.default.author.findMany({ include: { books: true } });
    }
    async findById(authorId) {
        const author = await prisma_1.default.author.findUnique({
            where: { id: authorId },
            include: { books: true },
        });
        if (!author) {
            throw new Error("Autor no encontrado");
        }
        return author;
    }
    async createAuthor(name, biography) {
        return prisma_1.default.author.create({
            data: { name, biography },
            include: { books: true },
        });
    }
    async updateAuthor(authorId, data) {
        await this.findById(authorId);
        return prisma_1.default.author.update({
            where: { id: authorId },
            data,
            include: { books: true },
        });
    }
    async deleteAuthor(authorId) {
        const books = await prisma_1.default.book.findMany({ where: { authorId } });
        if (books.length > 0) {
            throw new Error("No se puede eliminar un autor que tiene libros asociados");
        }
        await prisma_1.default.author.delete({ where: { id: authorId } });
        return { message: "Autor eliminado" };
    }
}
exports.AuthorsService = AuthorsService;
//# sourceMappingURL=authors.service.js.map