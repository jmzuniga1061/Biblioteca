export declare class AuthorsService {
    findAll(): Promise<({
        books: {
            id: number;
            description: string | null;
            createdAt: Date;
            isbn: string;
            title: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            price: number;
            authorId: number;
            categoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        biography: string | null;
    })[]>;
    findById(authorId: number): Promise<{
        books: {
            id: number;
            description: string | null;
            createdAt: Date;
            isbn: string;
            title: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            price: number;
            authorId: number;
            categoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        biography: string | null;
    }>;
    createAuthor(name: string, biography?: string): Promise<{
        books: {
            id: number;
            description: string | null;
            createdAt: Date;
            isbn: string;
            title: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            price: number;
            authorId: number;
            categoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        biography: string | null;
    }>;
    updateAuthor(authorId: number, data: {
        name?: string;
        biography?: string;
    }): Promise<{
        books: {
            id: number;
            description: string | null;
            createdAt: Date;
            isbn: string;
            title: string;
            editorial: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            year: string | null;
            price: number;
            authorId: number;
            categoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        biography: string | null;
    }>;
    deleteAuthor(authorId: number): Promise<{
        message: string;
    }>;
}
