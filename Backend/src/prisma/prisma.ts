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
          name: "Administrador por Defecto",
          email: adminEmail,
          password: hashedPassword,
          roleId: adminRole.id,
        },
      });
      console.log("Default administrator user created: admin@biblioteca.com / admin123");
    }
  }
}

export default prisma;