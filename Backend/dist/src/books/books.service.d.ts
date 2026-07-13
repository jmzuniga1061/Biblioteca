interface BookPayload {
    title: string;
    isbn: string;
    description?: string;
    editorial?: string;
    stock?: number;
    available?: boolean;
    imageUrl?: string;
    authorId: number;
    categoryId: number;
}
export declare class BooksService {
    findAll(): Promise<({
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
        category: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
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
    })[]>;
    findById(bookId: number): Promise<{
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
        category: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
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
    }>;
    createBook(data: BookPayload): Promise<{
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
        category: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
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
    }>;
    updateBook(bookId: number, data: Partial<BookPayload>): Promise<{
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
        category: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
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
    }>;
    deleteBook(bookId: number): Promise<{
        message: string;
    }>;
    searchBooks(query?: string): Promise<({
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
        category: {
            id: number;
            name: string;
            description: string | null;
        };
    } & {
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
    })[]>;
}
export {};
