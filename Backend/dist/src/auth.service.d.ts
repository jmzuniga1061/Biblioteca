interface JwtPayload {
    userId: number;
    email: string;
    roleName: string;
    name: string;
}
export declare class AuthService {
    register(name: string, email: string, password: string, roleName: string): Promise<string>;
    login(email: string, password: string): Promise<string>;
    refreshToken(token: string): Promise<string>;
    logout(): Promise<{
        message: string;
    }>;
    generateToken(userId: number, email: string, roleName: string, name: string): string;
    verifyToken(token: string): JwtPayload | null;
}
export {};
