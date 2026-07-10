export declare class UsersService {
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }[]>;
    findById(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    updateUser(userId: number, data: {
        name?: string;
        email?: string;
        password?: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    deleteUser(userId: number): Promise<{
        message: string;
    }>;
    changeUserRole(userId: number, roleName: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    findProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
}
