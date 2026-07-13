"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "1h";
class AuthService {
    async register(name, email, password, roleName = "cliente") {
        const emailLower = email.toLowerCase();
        const existingUser = await prisma_1.default.user.findUnique({ where: { email: emailLower } });
        if (existingUser) {
            throw new Error("El correo ya está registrado");
        }
        const finalRoleName = roleName || "cliente";
        const role = await prisma_1.default.role.findUnique({ where: { name: finalRoleName } });
        if (!role) {
            throw new Error(`Rol no encontrado: ${finalRoleName}`);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await prisma_1.default.user.create({
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
    async login(email, password) {
        const emailLower = email.toLowerCase();
        const user = await prisma_1.default.user.findUnique({ where: { email: emailLower }, include: { role: true } });
        if (!user) {
            throw new Error("Credenciales inválidas");
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Credenciales inválidas");
        }
        return this.generateToken(user.id, user.email, user.role.name, user.name);
    }
    async refreshToken(token) {
        const payload = this.verifyToken(token);
        if (!payload) {
            throw new Error("Token inválido o expirado");
        }
        return this.generateToken(payload.userId, payload.email, payload.roleName, payload.name);
    }
    async logout() {
        return { message: "Sesión invalidada en frontend" };
    }
    generateToken(userId, email, roleName, name) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET no está configurado");
        }
        const payload = { userId, email, roleName, name };
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
    }
    verifyToken(token) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET no está configurado");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            return decoded;
        }
        catch {
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map