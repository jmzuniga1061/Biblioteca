export declare class CategoriesService {
    findAll(): Promise<({
        books: {
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
            title: string;
            isbn: string;
            editorial: string | null;
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
        description: string | null;
    }>;
    createCategory(name: string, description?: string): Promise<{
        books: {
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
            title: string;
            isbn: string;
            editorial: string | null;
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
        description: string | null;
    }>;
    deleteCategory(categoryId: number): Promise<{
        message: string;
    }>;
}
