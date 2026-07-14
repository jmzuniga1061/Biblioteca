import prisma from "../prisma/prisma";

const LOAN_LIMIT = 3;
const BASE_FINE_PER_DAY = 2;

function maxLoanDays(roleName: string) {
  const roleLower = roleName.toLowerCase();
  switch (roleLower) {
    case "cliente":
    case "estudiante":
      return 10;
    case "profesor":
      return 365;
    default:
      return 10;
  }
}

function fineMultiplier(roleName: string) {
  const roleLower = roleName.toLowerCase();
  if (roleLower === "profesor") return 0;
  if (roleLower === "estudiante") return 0.5;
  return 1;
}

export class LoansService {
  async activeLoansCount(userId: number) {
    return prisma.loan.count({ where: { userId, returnDate: null } });
  }

  async findLoanById(loanId: number) {
    const loan = await prisma.loan.findUnique({
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

  async findLoansForUser(userId: number, roleName: string) {
    const roleLower = roleName.toLowerCase();
    let loans;
    if (roleLower === "bibliotecario" || roleLower === "admin" || roleLower === "administrador" || roleLower === "subadministrador") {
      loans = await prisma.loan.findMany({
        include: {
          book: true,
          user: {
            include: {
              role: true,
            },
          },
        },
      });
    } else {
      loans = await prisma.loan.findMany({
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

    return loans.map(loan => {
      const loanDate = new Date(loan.loanDate);
      const dueDate = new Date(loanDate);
      dueDate.setDate(dueDate.getDate() + maxLoanDays(loan.user.role.name));
      const overdue = !loan.returnDate && new Date() > dueDate;
      return {
        ...loan,
        dueDate,
        overdue,
      };
    });
  }

  async createLoan(userId: number, roleName: string, bookId: number, documentType?: string) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
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

    const roleLower = roleName.toLowerCase();
    if (!documentType || documentType.trim() === "") {
      throw new Error("Debe ingresar una identificación para continuar con el préstamo");
    }
    const docType = documentType;

    const basePrice = book.price || 0;
    let finalPrice = basePrice;
    if (roleLower === "profesor") {
      finalPrice = 0;
    } else if (roleLower === "estudiante") {
      finalPrice = parseFloat((basePrice * 0.5).toFixed(2));
    }

    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        loanDate,
        returnDate: null,
        status: "Pendiente",
        documentType: docType,
        price: finalPrice,
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

    await prisma.book.update({ where: { id: bookId }, data: { available: false } });

    return {
      loan,
      dueDate,
      feePolicy: {
        maxDays: maxLoanDays(roleName),
        discount: roleLower === "profesor" ? "100%" : roleLower === "estudiante" ? "50%" : "0%",
        finalPrice,
      },
    };
  }

  async returnLoan(loanId: number, userId: number, roleName: string) {
    const loan = await this.findLoanById(loanId);
    if (loan.returnDate) {
      throw new Error("El préstamo ya fue devuelto");
    }

    if (roleName !== "bibliotecario" && loan.userId !== userId) {
      throw new Error("No tienes permiso para registrar esta devolución");
    }

    const now = new Date();
    const fine = this.calculateFine(loan, now);

    await prisma.loan.update({
      where: { id: loanId },
      data: { returnDate: now, status: "Devuelto" },
    });

    await prisma.book.update({ where: { id: loan.bookId }, data: { available: true } });

    return { loanId, returnedAt: now, fine };
  }

  calculateFine(loan: any, returnDate: Date) {
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

  async getBookLoanStatus(bookId: number) {
    const activeLoan = await prisma.loan.findFirst({
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

    const book = await prisma.book.findUnique({ where: { id: bookId } });
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
