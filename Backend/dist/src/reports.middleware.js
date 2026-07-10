"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeReportsAccess = void 0;
const auth_middleware_1 = require("./auth.middleware");
exports.authorizeReportsAccess = (0, auth_middleware_1.authorizeRoles)(["bibliotecario", "admin"]);
//# sourceMappingURL=reports.middleware.js.map