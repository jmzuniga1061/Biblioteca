import prisma from "../prisma/prisma";

export class CategoriesService {
  async findAll() {
    return prisma.category.findMany({ include: { books: true } });
  }

  async findById(categoryId: number) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { books: true },
    });
    if (!category) {
      throw new Error("Categoría no encontrada");
    }
    return category;
  }

  async createCategory(name: string, description?: string) {
    return prisma.category.create({
      data: { name, description },
      include: { books: true },
    });
  }

  async updateCategory(categoryId: number, data: { name?: string; description?: string }) {
    await this.findById(categoryId);
    return prisma.category.update({
      where: { id: categoryId },
      data,
      include: { books: true },
    });
  }

  async deleteCategory(categoryId: number) {
    const books = await prisma.book.findMany({ where: { categoryId } });
    if (books.length > 0) {
      throw new Error("No se puede eliminar una categoría que tiene libros asociados");
    }

    await prisma.category.delete({ where: { id: categoryId } });
    return { message: "Categoría eliminada" };
  }
}
