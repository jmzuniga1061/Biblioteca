"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async loansMonthly() {
        const result = await this.prisma.$queryRawUnsafe(`SELECT TO_CHAR("loanDate", 'YYYY-MM') AS month, COUNT(*) AS count
       FROM "Loan"
       GROUP BY month
       ORDER BY month DESC`);
        return result.map((row) => ({
            month: row.month,
            count: Number(row.count),
        }));
    }
    async booksTop(limit = 10) {
        const result = await this.prisma.$queryRawUnsafe(`SELECT b.id AS "bookId", b.title, COUNT(l.id) AS "loanCount"
       FROM "Book" b
       LEFT JOIN "Loan" l ON l."bookId" = b.id
       GROUP BY b.id, b.title
       ORDER BY "loanCount" DESC
       LIMIT ${limit}`);
        return result.map((row) => ({
            bookId: Number(row.bookId),
            title: row.title,
            loanCount: Number(row.loanCount),
        }));
    }
    async usersActive(limit = 10) {
        const result = await this.prisma.$queryRawUnsafe(`SELECT u.id AS "userId", u.name, u.email, r.name AS "roleName", COUNT(l.id) AS "loanCount"
       FROM "User" u
       LEFT JOIN "Loan" l ON l."userId" = u.id
       LEFT JOIN "Role" r ON u."roleId" = r.id
       GROUP BY u.id, u.name, u.email, r.name
       ORDER BY "loanCount" DESC
       LIMIT ${limit}`);
        return result.map((row) => ({
            userId: Number(row.userId),
            name: row.name,
            email: row.email,
            roleName: row.roleName,
            loanCount: Number(row.loanCount),
        }));
    }
    async loansOverdue() {
        const now = new Date();
        const loans = await this.prisma.loan.findMany({
            where: {
                returnDate: null,
                loanDate: {
                    lt: new Date(new Date().setDate(now.getDate() - 10)),
                },
            },
            include: {
                user: {
                    include: {
                        role: true,
                    },
                },
                book: true,
            },
        });
        return loans.map((loan) => {
            const dueDate = new Date(loan.loanDate);
            dueDate.setDate(dueDate.getDate() +
                (loan.user.role.name === 'profesor' ? 365 : 10));
            const daysOverdue = Math.max(0, Math.ceil((now.getTime() - dueDate.getTime()) /
                (1000 * 60 * 60 * 24)));
            const fine = loan.user.role.name === 'profesor'
                ? 0
                : daysOverdue *
                    2 *
                    (loan.user.role.name === 'estudiante' ? 0.5 : 1);
            return {
                loanId: loan.id,
                user: {
                    id: loan.user.id,
                    name: loan.user.name,
                    email: loan.user.email,
                    role: loan.user.role.name,
                },
                book: {
                    id: loan.book.id,
                    title: loan.book.title,
                },
                loanDate: loan.loanDate,
                dueDate,
                daysOverdue,
                fine,
            };
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map