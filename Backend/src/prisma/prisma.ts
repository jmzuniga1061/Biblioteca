import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

export async function ensureRoles() {
  const roles = ["cliente", "estudiante", "profesor", "bibliotecario", "administrador", "subadministrador", "admin"];
  for (const r of roles) {
    const existing = await prisma.role.findUnique({ where: { name: r } });
    if (!existing) {
      await prisma.role.create({
        data: {
          name: r,
          description: `Rol de ${r}`,
        },
      });
    }
  }

  // Create default admin user
  const adminEmail = "admin@biblioteca.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const adminRole = await prisma.role.findUnique({ where: { name: "administrador" } });
    if (adminRole) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "Administrador",
          email: adminEmail,
          password: hashedPassword,
          roleId: adminRole.id,
        },
      });
      console.log("Default administrator user created: admin@biblioteca.com / admin123");
    }
  }

  // Ensure initial categories exist
  const categoriesList = ["Novela", "Ciencia", "Historia", "Tecnología", "Educación", "Filosofía", "Psicología", "Arte"];
  for (const catName of categoriesList) {
    const existingCat = await prisma.category.findUnique({ where: { name: catName } });
    if (!existingCat) {
      await prisma.category.create({
        data: {
          name: catName,
          description: `Categoría de ${catName}`,
        },
      });
    }
  }

  // Seed books
  const booksToSeed = [
    { title: "Cien Años de Soledad", author: "Gabriel García Márquez", editorial: "Editorial Sudamericana", year: "1967", category: "Novela", stock: 5, isbn: "978-0307474728", imageUrl: "/covers/cover_novela.png" },
    { title: "El Principito", author: "Antoine de Saint-Exupéry", editorial: "Editorial Reynal & Hitchcock", year: "1943", category: "Educación", stock: 10, isbn: "978-0156012195", imageUrl: "/covers/cover_educacion.png" },
    { title: "Breves respuestas a las grandes preguntas", author: "Stephen Hawking", editorial: "Editorial Crítica", year: "2018", category: "Ciencia", stock: 7, isbn: "978-8491990864", imageUrl: "/covers/cover_ciencia.png" },
    { title: "Sapiens: De animales a dioses", author: "Yuval Noah Harari", editorial: "Editorial Debate", year: "2011", category: "Historia", stock: 6, isbn: "978-8499926223", imageUrl: "/covers/cover_historia.png" },
    { title: "Clean Code", author: "Robert C. Martin", editorial: "Editorial Prentice Hall", year: "2008", category: "Tecnología", stock: 4, isbn: "978-0132350884", imageUrl: "/covers/cover_tecnologia.png" },
    { title: "1984", author: "George Orwell", editorial: "Editorial Secker & Warburg", year: "1949", category: "Novela", stock: 8, isbn: "978-0451524935", imageUrl: "/covers/cover_novela.png" },
    { title: "La Odisea", author: "Homero", editorial: "Editorial Gredos", year: "Año desconocido", category: "Historia", stock: 3, isbn: "978-8424924614", imageUrl: "/covers/cover_historia.png" },
    { title: "El Mundo de Sofía", author: "Jostein Gaarder", editorial: "Editorial Siruela", year: "1991", category: "Filosofía", stock: 6, isbn: "978-8478442515", imageUrl: "/covers/cover_filosofia.png" },
    { title: "Psicología del Aprendizaje", author: "B.F. Skinner", editorial: "Editorial Pearson", year: "1953", category: "Psicología", stock: 5, isbn: "978-0024115102", imageUrl: "/covers/cover_psicologia.png" },
    { title: "Arte y percepción visual", author: "Rudolf Arnheim", editorial: "Editorial Alianza", year: "1954", category: "Arte", stock: 4, isbn: "978-8420678740", imageUrl: "/covers/cover_arte.png" },
    { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", editorial: "Editorial Francisco de Robles", year: "1605", category: "Novela", stock: 7, isbn: "978-8497402422", imageUrl: "/covers/cover_novela.png" },
    { title: "La Historia del Tiempo", author: "Stephen Hawking", editorial: "Editorial Bantam", year: "1988", category: "Ciencia", stock: 6, isbn: "978-0553380163", imageUrl: "/covers/cover_ciencia.png" },
    { title: "El Hombre en busca de sentido", author: "Viktor Frankl", editorial: "Editorial Herder", year: "1946", category: "Psicología", stock: 5, isbn: "978-8425432026", imageUrl: "/covers/cover_psicologia.png" },
    { title: "La República", author: "Platón", editorial: "Editorial Akal", year: "Año antiguo", category: "Filosofía", stock: 4, isbn: "978-8446011989", imageUrl: "/covers/cover_filosofia.png" },
    { title: "Introducción a los Algoritmos", author: "Thomas H. Cormen", editorial: "Editorial MIT Press", year: "1990", category: "Tecnología", stock: 3, isbn: "978-0262033848", imageUrl: "/covers/cover_tecnologia.png" },
    { title: "Historia de la Segunda Guerra Mundial", author: "Antony Beevor", editorial: "Editorial Crítica", year: "2012", category: "Historia", stock: 5, isbn: "978-8498925340", imageUrl: "/covers/cover_historia.png" },
    { title: "Educación y Sociedad", author: "Émile Durkheim", editorial: "Editorial Akal", year: "1922", category: "Educación", stock: 4, isbn: "978-8476000212", imageUrl: "/covers/cover_educacion.png" },
    { title: "El Arte de la Guerra", author: "Sun Tzu", editorial: "Editorial Edaf", year: "Año antiguo", category: "Historia", stock: 6, isbn: "978-8476406540", imageUrl: "/covers/cover_historia.png" },
    { title: "La Divina Comedia", author: "Dante Alighieri", editorial: "Editorial Alianza", year: "1320", category: "Novela", stock: 3, isbn: "978-8420651071", imageUrl: "/covers/cover_novela.png" },
    { title: "El Gen Egoísta", author: "Richard Dawkins", editorial: "Editorial Oxford University Press", year: "1976", category: "Ciencia", stock: 5, isbn: "978-0199291151", imageUrl: "/covers/cover_ciencia.png" },
  ];

  for (const b of booksToSeed) {
    // 1. Ensure author exists
    let author = await prisma.author.findFirst({ where: { name: b.author } });
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: b.author,
          biography: `Autor de renombre: ${b.author}`,
        },
      });
    }

    // 2. Ensure category exists
    const category = await prisma.category.findUnique({ where: { name: b.category } });
    if (!category) continue;

    // 3. Ensure book exists (by ISBN)
    const existingBook = await prisma.book.findUnique({ where: { isbn: b.isbn } });
    const randomPrice = parseFloat((Math.random() * (50 - 5) + 5).toFixed(2));
    if (!existingBook) {
      await prisma.book.create({
        data: {
          title: b.title,
          isbn: b.isbn,
          editorial: b.editorial,
          year: b.year,
          stock: b.stock,
          price: randomPrice,
          available: true,
          imageUrl: b.imageUrl,
          authorId: author.id,
          categoryId: category.id,
          description: `Obra clásica de ${b.author} en la categoría de ${b.category}.`,
        },
      });
    } else if (existingBook.price === 0) {
      await prisma.book.update({
        where: { id: existingBook.id },
        data: { price: randomPrice },
      });
    }
  }
}

export default prisma;