"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeBibliotecario = authorizeBibliotecario;
function authorizeBibliotecario(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }
    if (req.user.roleName !== "bibliotecario") {
        return res.status(403).json({ error: "Solo bibliotecarios pueden realizar esta acción" });
    }
    next();
}
//# sourceMappingURL=books.middleware.js.map