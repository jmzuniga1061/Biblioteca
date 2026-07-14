export declare class CategoriesService {
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
        description: string | null;
    })[]>;
    findById(categoryId: number): Promise<{
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
        description: string | null;
    }>;
    createCategory(name: string, description?: string): Promise<{
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
        description: string | null;
    }>;
    updateCategory(categoryId: number, data: {
        name?: string;
        description?: string;
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
        description: string | null;
    }>;
    deleteCategory(categoryId: number): Promise<{
        message: string;
    }>;
}
