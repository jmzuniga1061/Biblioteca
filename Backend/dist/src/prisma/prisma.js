"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.ensureRoles = ensureRoles;
const client_1 = require("../generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt_1 = __importDefault(require("bcrypt"));
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({
    adapter,
});
async function ensureRoles() {
    const roles = ["cliente", "estudiante", "profesor", "bibliotecario", "administrador", "subadministrador", "admin"];
    for (const r of roles) {
        const existing = await exports.prisma.role.findUnique({ where: { name: r } });
        if (!existing) {
            await exports.prisma.role.create({
                data: {
                    name: r,
                    description: `Rol de ${r}`,
                },
            });
        }
    }
    const adminEmail = "admin@biblioteca.com";
    const existingAdmin = await exports.prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const adminRole = await exports.prisma.role.findUnique({ where: { name: "administrador" } });
        if (adminRole) {
            const hashedPassword = await bcrypt_1.default.hash("admin123", 10);
            await exports.prisma.user.create({
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
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map