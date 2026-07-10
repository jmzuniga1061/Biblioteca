import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "1h";

interface JwtPayload {
  userId: number;
  email: string;
  roleName: string;
  name: string;
}

export class AuthService {
  async register(name: string, email: string, password: string, roleName: string) {
    const emailLower = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existingUser) {
      throw new Error("El correo ya está registrado");
    }

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Rol no encontrado: ${roleName}`);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name,
        email: emailLower,
        password: hashedPassword,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    return this.generateToken(user.id, user.email, user.role.name, user.name);
  }

  async login(email: string, password: string) {
    const emailLower = email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailLower }, include: { role: true } });
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Credenciales inválidas");
    }

    return this.generateToken(user.id, user.email, user.role.name, user.name);
  }

  async refreshToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) {
      throw new Error("Token inválido o expirado");
    }
    return this.generateToken(payload.userId, payload.email, payload.roleName, payload.name);
  }

  async logout() {
    return { message: "Sesión invalidada en frontend" };
  }

  generateToken(userId: number, email: string, roleName: string, name: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const payload: JwtPayload = { userId, email, roleName, name };
    return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token: string): JwtPayload | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}
