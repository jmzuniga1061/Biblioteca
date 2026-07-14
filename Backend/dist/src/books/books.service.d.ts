interface BookPayload {
    title: string;
    isbn: string;
    description?: string;
    editorial?: string;
    stock?: number;
    available?: boolean;
    imageUrl?: string;
    year?: string;
    authorId: number;
    categoryId: number;
}
export declare class BooksService {
    findAll(): Promise<({
        category: {
            id: number;
            name: string;
            description: string | null;
        };
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
    } & {
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
    })[]>;
    findById(bookId: number): Promise<{
        category: {
            id: number;
            name: string;
            description: string | null;
        };
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
    } & {
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
    }>;
    createBook(data: BookPayload): Promise<{
        category: {
            id: number;
            name: string;
            description: string | null;
        };
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
    } & {
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
    }>;
    updateBook(bookId: number, data: Partial<BookPayload>): Promise<{
        category: {
            id: number;
            name: string;
            description: string | null;
        };
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
    } & {
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
    }>;
    deleteBook(bookId: number): Promise<{
        message: string;
    }>;
    searchBooks(query?: string): Promise<({
        category: {
            id: number;
            name: string;
            description: string | null;
        };
        author: {
            id: number;
            name: string;
            biography: string | null;
        };
    } & {
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
    })[]>;
}
export {};
