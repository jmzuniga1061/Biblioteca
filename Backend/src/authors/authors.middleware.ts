import { authorizeRoles } from "../auth/auth.middleware";

export const authorizeBibliotecario = authorizeRoles(["bibliotecario", "admin", "administrador", "subadministrador"]);
