import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
export declare function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
