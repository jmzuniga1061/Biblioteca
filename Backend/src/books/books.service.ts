import prisma from "../prisma/prisma";

interface BookPayload {
  title: string;
  isbn: string;
  description?: string;
  editorial?: string;
  stock?: number;
  available?: boolean;
  imageUrl?: string;
  authorId: number;
  categoryId: number;
}

export class BooksService {
  async findAll() {
    return prisma.book.findMany({
      include: {
        author: true,
        category: true,
      },
    });
  }

  async findById(bookId: number) {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: true, category: true },
    });
    if (!book) {
      throw new Error("Libro no encontrado");
    }
    return book;
  }

  async createBook(data: BookPayload) {
    const author = await prisma.author.findUnique({ where: { id: data.authorId } });
    if (!author) {
      throw new Error("Autor no encontrado");
    }
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        description: data.description,
        editorial: data.editorial,
        stock: data.stock ?? 1,
        available: data.available ?? true,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        categoryId: data.categoryId,
      },
      include: { author: true, category: true },
    });
  }

  async updateBook(bookId: number, data: Partial<BookPayload>) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new Error("Libro no encontrado");
    }

    if (data.authorId) {
      const author = await prisma.author.findUnique({ where: { id: data.authorId } });
      if (!author) {
        throw new Error("Autor no encontrado");
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        throw new Error("Categoría no encontrada");
      }
    }

    return prisma.book.update({
      where: { id: bookId },
      data: {
        title: data.title,
        isbn: data.isbn,
        description: data.description,
        editorial: data.editorial,
        stock: data.stock,
        available: data.available,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        categoryId: data.categoryId,
      },
      include: { author: true, category: true },
    });
  }

  async deleteBook(bookId: number) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new Error("Libro no encontrado");
    }

    await prisma.book.delete({ where: { id: bookId } });
    return { message: "Libro eliminado" };
  }

  async searchBooks(query?: string) {
    const normalized = query?.trim() ?? "";
    const year = normalized ? Number(normalized) : NaN;
    const where = normalized
      ? {
          OR: [
            { title: { contains: normalized, mode: "insensitive" as const } },
            { description: { contains: normalized, mode: "insensitive" as const } },
            { isbn: { contains: normalized, mode: "insensitive" as const } },
            { editorial: { contains: normalized, mode: "insensitive" as const } },
            { author: { name: { contains: normalized, mode: "insensitive" as const } } },
            { category: { name: { contains: normalized, mode: "insensitive" as const } } },
            ...(Number.isFinite(year)
              ? [
                  {
                    createdAt: {
                      gte: new Date(year, 0, 1),
                      lt: new Date(year + 1, 0, 1),
                    },
                  },
                ]
              : []),
          ],
        }
      : {};

    return prisma.book.findMany({
      where,
      include: { author: true, category: true },
    });
  }
}
