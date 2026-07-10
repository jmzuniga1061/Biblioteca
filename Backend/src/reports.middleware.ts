import { authorizeRoles } from "./auth.middleware";

export const authorizeReportsAccess = authorizeRoles(["bibliotecario", "admin"]);
