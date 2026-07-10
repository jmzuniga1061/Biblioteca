import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.roleName !== "admin") {
    return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
  }

  next();
}
