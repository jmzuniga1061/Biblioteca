import { authorizeRoles } from "./auth.middleware";

export const authorizeBibliotecario = authorizeRoles(["bibliotecario"]);
