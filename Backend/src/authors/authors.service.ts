import prisma from "../prisma/prisma";

export class AuthorsService {
  async findAll() {
    return prisma.author.findMany({ include: { books: true } });
  }

  async findById(authorId: number) {
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: { books: true },
    });
    if (!author) {
      throw new Error("Autor no encontrado");
    }
    return author;
  }

  async createAuthor(name: string, biography?: string) {
    return prisma.author.create({
      data: { name, biography },
      include: { books: true },
    });
  }

  async updateAuthor(authorId: number, data: { name?: string; biography?: string }) {
    await this.findById(authorId);
    return prisma.author.update({
      where: { id: authorId },
      data,
      include: { books: true },
    });
  }

  async deleteAuthor(authorId: number) {
    const books = await prisma.book.findMany({ where: { authorId } });
    if (books.length > 0) {
      throw new Error("No se puede eliminar un autor que tiene libros asociados");
    }

    await prisma.author.delete({ where: { id: authorId } });
    return { message: "Autor eliminado" };
  }
}
