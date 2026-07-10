import { PrismaService } from './prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    loansMonthly(): Promise<{
        month: string;
        count: number;
    }[]>;
    booksTop(limit?: number): Promise<{
        bookId: number;
        title: string;
        loanCount: number;
    }[]>;
    usersActive(limit?: number): Promise<{
        userId: number;
        name: string;
        email: string;
        roleName: string;
        loanCount: number;
    }[]>;
    loansOverdue(): Promise<{
        loanId: number;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        book: {
            id: number;
            title: string;
        };
        loanDate: Date;
        dueDate: Date;
        daysOverdue: number;
        fine: number;
    }[]>;
}
