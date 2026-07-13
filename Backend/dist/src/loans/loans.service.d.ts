export declare class LoansService {
    activeLoansCount(userId: number): Promise<number>;
    findLoanById(loanId: number): Promise<{
        book: {
            id: number;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
            authorId: number;
            categoryId: number;
        };
        user: {
            role: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            name: string;
            createdAt: Date;
            email: string;
            password: string;
            roleId: number;
        };
    } & {
        id: number;
        userId: number;
        returnDate: Date | null;
        bookId: number;
        loanDate: Date;
        status: string;
        documentType: string;
    }>;
    findLoansForUser(userId: number, roleName: string): Promise<({
        book: {
            id: number;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
            authorId: number;
            categoryId: number;
        };
        user: {
            role: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            name: string;
            createdAt: Date;
            email: string;
            password: string;
            roleId: number;
        };
    } & {
        id: number;
        userId: number;
        returnDate: Date | null;
        bookId: number;
        loanDate: Date;
        status: string;
        documentType: string;
    })[]>;
    createLoan(userId: number, roleName: string, bookId: number, documentType?: string): Promise<{
        loan: {
            book: {
                id: number;
                description: string | null;
                title: string;
                isbn: string;
                editorial: string | null;
                stock: number;
                available: boolean;
                imageUrl: string | null;
                createdAt: Date;
                authorId: number;
                categoryId: number;
            };
            user: {
                role: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
                id: number;
                name: string;
                createdAt: Date;
                email: string;
                password: string;
                roleId: number;
            };
        } & {
            id: number;
            userId: number;
            returnDate: Date | null;
            bookId: number;
            loanDate: Date;
            status: string;
            documentType: string;
        };
        dueDate: Date;
        feePolicy: {
            maxDays: number;
            discount: string;
        };
    }>;
    returnLoan(loanId: number, userId: number, roleName: string): Promise<{
        loanId: number;
        returnedAt: Date;
        fine: number;
    }>;
    calculateFine(loan: any, returnDate: Date): number;
    getBookLoanStatus(bookId: number): Promise<{
        book: {
            id: number;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
            authorId: number;
            categoryId: number;
        };
        available: boolean;
        status: string;
        loan?: undefined;
    } | {
        book: {
            id: number;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
            authorId: number;
            categoryId: number;
        };
        status: string;
        loan: {
            id: number;
            loanDate: Date;
            dueDate: Date;
            user: {
                id: number;
                name: string;
                email: string;
                role: string;
            };
        };
        available?: undefined;
    }>;
}
