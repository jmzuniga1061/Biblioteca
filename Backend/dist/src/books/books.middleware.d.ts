import { NextFunction, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
export declare function authorizeBibliotecario(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function authorizeOnlyBibliotecario(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
