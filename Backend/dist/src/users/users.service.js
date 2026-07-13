"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
const SALT_ROUNDS = 10;
function sanitizeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        createdAt: user.createdAt,
    };
}
class UsersService {
    async findAll() {
        const users = await prisma_1.default.user.findMany({ include: { role: true } });
        return users.map((user) => sanitizeUser(user));
    }
    async findById(userId) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId }, include: { role: true } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return sanitizeUser(user);
    }
    async updateUser(userId, data) {
        const existing = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!existing) {
            throw new Error("Usuario no encontrado");
        }
        if (data.email) {
            const emailLower = data.email.toLowerCase();
            const conflict = await prisma_1.default.user.findUnique({ where: { email: emailLower } });
            if (conflict && conflict.id !== userId) {
                throw new Error("El correo ya está en uso");
            }
            data.email = emailLower;
        }
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        }
        const updated = await prisma_1.default.user.update({
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
    async deleteUser(userId) {
        const existing = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!existing) {
            throw new Error("Usuario no encontrado");
        }
        await prisma_1.default.user.delete({ where: { id: userId } });
        return { message: "Usuario eliminado" };
    }
    async changeUserRole(userId, roleName) {
        const role = await prisma_1.default.role.findUnique({ where: { name: roleName } });
        if (!role) {
            throw new Error("Rol no encontrado");
        }
        const updated = await prisma_1.default.user.update({
            where: { id: userId },
            data: { roleId: role.id },
            include: { role: true },
        });
        return sanitizeUser(updated);
    }
    async findProfile(userId) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId }, include: { role: true } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return sanitizeUser(user);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map