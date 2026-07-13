import { authorizeRoles } from "../auth/auth.middleware";

export const authorizeReportsAccess = authorizeRoles(["bibliotecario", "admin", "administrador", "subadministrador"]);
