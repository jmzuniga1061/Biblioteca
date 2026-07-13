"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
function authenticateToken(req, res, next) {
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
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
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
//# sourceMappingURL=auth.middleware.js.map