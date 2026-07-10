"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansService = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const LOAN_LIMIT = 3;
const BASE_FINE_PER_DAY = 2;
function maxLoanDays(roleName) {
    switch (roleName) {
        case "cliente":
        case "estudiante":
            return 10;
        case "profesor":
            return 365;
        default:
            return 10;
    }
}
function fineMultiplier(roleName) {
    if (roleName === "profesor")
        return 0;
    if (roleName === "estudiante")
        return 0.5;
    return 1;
}
class LoansService {
    async activeLoansCount(userId) {
        return prisma_1.default.loan.count({ where: { userId, returnDate: null } });
    }
    async findLoanById(loanId) {
        const loan = await prisma_1.default.loan.findUnique({
            where: { id: loanId },
            include: {
                book: true,
                user: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!loan) {
            throw new Error("Préstamo no encontrado");
        }
        return loan;
    }
    async findLoansForUser(userId, roleName) {
        if (roleName === "bibliotecario" || roleName === "admin") {
            return prisma_1.default.loan.findMany({
                include: {
                    book: true,
                    user: {
                        include: {
                            role: true,
                        },
                    },
                },
            });
        }
        return prisma_1.default.loan.findMany({
            where: { userId },
            include: {
                book: true,
                user: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async createLoan(userId, roleName, bookId) {
        const book = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new Error("Libro no encontrado");
        }
        if (!book.available) {
            throw new Error("Libro no disponible para préstamo");
        }
        const activeCount = await this.activeLoansCount(userId);
        if (activeCount >= LOAN_LIMIT) {
            throw new Error("Has alcanzado el número máximo de préstamos activos (3)");
        }
        const loanDate = new Date();
        const dueDate = new Date(loanDate);
        dueDate.setDate(dueDate.getDate() + maxLoanDays(roleName));
        const loan = await prisma_1.default.loan.create({
            data: {
                userId,
                bookId,
                loanDate,
                returnDate: null,
                status: "Pendiente",
            },
            include: {
                book: true,
                user: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        await prisma_1.default.book.update({ where: { id: bookId }, data: { available: false } });
        return {
            loan,
            dueDate,
            feePolicy: {
                maxDays: maxLoanDays(roleName),
                discount: roleName === "profesor" ? "100%" : roleName === "estudiante" ? "50%" : "0%",
            },
        };
    }
    async returnLoan(loanId, userId, roleName) {
        const loan = await this.findLoanById(loanId);
        if (loan.returnDate) {
            throw new Error("El préstamo ya fue devuelto");
        }
        if (roleName !== "bibliotecario" && loan.userId !== userId) {
            throw new Error("No tienes permiso para registrar esta devolución");
        }
        const now = new Date();
        const fine = this.calculateFine(loan, now);
        await prisma_1.default.loan.update({
            where: { id: loanId },
            data: { returnDate: now, status: "Devuelto" },
        });
        await prisma_1.default.book.update({ where: { id: loan.bookId }, data: { available: true } });
        return { loanId, returnedAt: now, fine };
    }
    calculateFine(loan, returnDate) {
        const roleName = loan.user.role.name;
        if (roleName === "profesor") {
            return 0;
        }
        const loanDate = new Date(loan.loanDate);
        const dueDate = new Date(loanDate);
        dueDate.setDate(dueDate.getDate() + maxLoanDays(roleName));
        const daysLate = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLate <= 0) {
            return 0;
        }
        return daysLate * BASE_FINE_PER_DAY * fineMultiplier(roleName);
    }
    async getBookLoanStatus(bookId) {
        const activeLoan = await prisma_1.default.loan.findFirst({
            where: { bookId, returnDate: null },
            include: {
                book: true,
                user: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        const book = await prisma_1.default.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new Error("Libro no encontrado");
        }
        if (!activeLoan) {
            return {
                book,
                available: true,
                status: "Disponible",
            };
        }
        const dueDate = new Date(activeLoan.loanDate);
        dueDate.setDate(dueDate.getDate() + maxLoanDays(activeLoan.user.role.name));
        return {
            book: activeLoan.book,
            status: "Prestado",
            loan: {
                id: activeLoan.id,
                loanDate: activeLoan.loanDate,
                dueDate,
                user: {
                    id: activeLoan.user.id,
                    name: activeLoan.user.name,
                    email: activeLoan.user.email,
                    role: activeLoan.user.role.name,
                },
            },
        };
    }
}
exports.LoansService = LoansService;
//# sourceMappingURL=loans.service.js.map