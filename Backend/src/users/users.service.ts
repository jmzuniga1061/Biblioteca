import bcrypt from "bcrypt";
import prisma from "../prisma/prisma";

const SALT_ROUNDS = 10;

function sanitizeUser(user: { id: number; name: string; email: string; role: { name: string }; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    createdAt: user.createdAt,
  };
}

export class UsersService {
  async findAll() {
    const users = await prisma.user.findMany({ include: { role: true } });
    return users.map((user) => sanitizeUser(user));
  }

  async findById(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return sanitizeUser(user);
  }

  async updateUser(userId: number, data: { name?: string; email?: string; password?: string }) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new Error("Usuario no encontrado");
    }

    if (data.email) {
      const emailLower = data.email.toLowerCase();
      const conflict = await prisma.user.findUnique({ where: { email: emailLower } });
      if (conflict && conflict.id !== userId) {
        throw new Error("El correo ya está en uso");
      }
      data.email = emailLower;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      include: { role: true },
    });

    return sanitizeUser(updated);
  }

  async deleteUser(userId: number) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new Error("Usuario no encontrado");
    }
    await prisma.user.delete({ where: { id: userId } });
    return { message: "Usuario eliminado" };
  }

  async changeUserRole(userId: number, roleName: string) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new Error("Rol no encontrado");
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
      include: { role: true },
    });
    return sanitizeUser(updated);
  }

  async findProfile(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return sanitizeUser(user);
  }
}
