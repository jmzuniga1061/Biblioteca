"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = authorizeAdmin;
function authorizeAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    if (req.user.roleName !== "admin") {
        return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
    }
    next();
}
//# sourceMappingURL=users.middleware.js.map