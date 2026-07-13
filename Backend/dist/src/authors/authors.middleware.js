"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeBibliotecario = void 0;
const auth_middleware_1 = require("../auth/auth.middleware");
exports.authorizeBibliotecario = (0, auth_middleware_1.authorizeRoles)(["bibliotecario", "admin", "administrador", "subadministrador"]);
//# sourceMappingURL=authors.middleware.js.map