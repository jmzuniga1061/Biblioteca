"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeBibliotecario = authorizeBibliotecario;
exports.authorizeOnlyBibliotecario = authorizeOnlyBibliotecario;
function authorizeBibliotecario(req, res, next) {
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
function authorizeOnlyBibliotecario(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    const roleLower = req.user.roleName.toLowerCase();
    if (roleLower !== "bibliotecario") {
        return res.status(403).json({ error: "Solo el bibliotecario puede editar o eliminar libros" });
    }
    next();
}
//# sourceMappingURL=books.middleware.js.map