"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
class CategoriesService {
    async findAll() {
        return prisma_1.default.category.findMany({ include: { books: true } });
    }
    async findById(categoryId) {
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId },
            include: { books: true },
        });
        if (!category) {
            throw new Error("Categoría no encontrada");
        }
        return category;
    }
    async createCategory(name, description) {
        return prisma_1.default.category.create({
            data: { name, description },
            include: { books: true },
        });
    }
    async updateCategory(categoryId, data) {
        await this.findById(categoryId);
        return prisma_1.default.category.update({
            where: { id: categoryId },
            data,
            include: { books: true },
        });
    }
    async deleteCategory(categoryId) {
        const books = await prisma_1.default.book.findMany({ where: { categoryId } });
        if (books.length > 0) {
            throw new Error("No se puede eliminar una categoría que tiene libros asociados");
        }
        await prisma_1.default.category.delete({ where: { id: categoryId } });
        return { message: "Categoría eliminada" };
    }
}
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map