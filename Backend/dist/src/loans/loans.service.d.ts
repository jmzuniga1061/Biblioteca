export declare class LoansService {
    activeLoansCount(userId: number): Promise<number>;
    findLoanById(loanId: number): Promise<{
        user: {
            role: {
                id: number;
                name: string;
                description: string | null;
            };
        } & {
            id: number;
            name: string;
            email: string;
            password: string;
            roleId: number;
            createdAt: Date;
        };
        book: {
            id: number;
            price: number;
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            authorId: number;
            categoryId: number;
        };
    } & {
        userId: number;
        returnDate: Date | null;
        id: number;
        bookId: number;
        loanDate: Date;
        status: string;
        documentType: string;
        price: number | null;
    }>;
    findLoansForUser(userId: number, roleName: string): Promise<any>;
    createLoan(userId: number, roleName: string, bookId: number, documentType?: string): Promise<{
        loan: {
            user: {
                role: {
                    id: number;
                    name: string;
                    description: string | null;
                };
            } & {
                id: number;
                name: string;
                email: string;
                password: string;
                roleId: number;
                createdAt: Date;
            };
            book: {
                id: number;
                price: number;
                createdAt: Date;
                description: string | null;
                title: string;
                isbn: string;
                editorial: string | null;
                stock: number;
                available: boolean;
                imageUrl: string | null;
                year: string | null;
                authorId: number;
                categoryId: number;
            };
        } & {
            userId: number;
            returnDate: Date | null;
            id: number;
            bookId: number;
            loanDate: Date;
            status: string;
            documentType: string;
            price: number | null;
        };
        dueDate: Date;
        feePolicy: {
            maxDays: number;
            discount: string;
            finalPrice: number;
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
            price: number;
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            authorId: number;
            categoryId: number;
        };
        available: boolean;
        status: string;
        loan?: undefined;
    } | {
        book: {
            id: number;
            price: number;
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
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
