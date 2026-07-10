export declare class AuthorsService {
    findAll(): Promise<({
        books: {
            id: number;
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            stock: number;
            available: boolean;
            imageUrl: string | null;
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
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            stock: number;
            available: boolean;
            imageUrl: string | null;
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
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            stock: number;
            available: boolean;
            imageUrl: string | null;
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
            createdAt: Date;
            description: string | null;
            title: string;
            isbn: string;
            stock: number;
            available: boolean;
            imageUrl: string | null;
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
