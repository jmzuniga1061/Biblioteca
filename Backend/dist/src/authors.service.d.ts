export declare class AuthorsService {
    findAll(): Promise<({
        books: {
            id: number;
            title: string;
            isbn: string;
            description: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
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
            title: string;
            isbn: string;
            description: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
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
            title: string;
            isbn: string;
            description: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
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
            title: string;
            isbn: string;
            description: string | null;
            stock: number;
            available: boolean;
            imageUrl: string | null;
            createdAt: Date;
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
