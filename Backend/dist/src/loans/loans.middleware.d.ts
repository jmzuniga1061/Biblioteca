import { NextFunction, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
export declare function authorizeLoanCreation(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function authorizeLoanDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function authorizeLoanReturn(req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
