import { NextFunction, Request, Response } from "express";
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        roleName: string;
        name: string;
    };
}
export declare function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function authorizeRoles(allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
