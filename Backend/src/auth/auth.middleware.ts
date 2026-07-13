import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roleName: string;
    name: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  req.user = payload;
  next();
}

export function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const userRole = req.user.roleName.toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
    }

    next();
  };
}
