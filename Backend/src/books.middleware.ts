import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export function authorizeBibliotecario(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.roleName !== "bibliotecario") {
    return res.status(403).json({ error: "Solo bibliotecarios pueden realizar esta acción" });
  }

  next();
}
