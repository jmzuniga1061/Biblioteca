import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";

export function authorizeBibliotecario(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const roleLower = req.user.roleName.toLowerCase();
  const allowed = ["bibliotecario", "admin", "administrador", "subadministrador"];
  if (!allowed.includes(roleLower)) {
    return res.status(403).json({ error: "Solo bibliotecarios y administradores pueden realizar esta acción" });
  }

  next();
}

export function authorizeOnlyBibliotecario(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const roleLower = req.user.roleName.toLowerCase();
  if (roleLower !== "bibliotecario") {
    return res.status(403).json({ error: "Solo el bibliotecario puede editar o eliminar libros" });
  }

  next();
}
