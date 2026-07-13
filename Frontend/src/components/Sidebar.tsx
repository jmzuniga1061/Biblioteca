import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const allItems = [
    { key: "/dashboard", label: <Link to="/dashboard">Inicio</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"] },
    { key: "/books", label: <Link to="/books">Libros</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"] },
    { key: "/loans", label: <Link to="/loans">Préstamos</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"] },
    { key: "/authors", label: <Link to="/authors">Autores</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"] },
    { key: "/categories", label: <Link to="/categories">Categorías</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"] },
    { key: "/users", label: <Link to="/users">Usuarios</Link>, roles: ["admin", "administrador", "subadministrador"] },
    { key: "/reports", label: <Link to="/reports">Reportes</Link>, roles: ["bibliotecario", "admin", "administrador", "subadministrador"] },
  ];

  const items = allItems
    .filter((item) => {
      if (!role) {
        return item.key === "/dashboard";
      }
      return item.roles.includes(role);
    })
    .map((item) => ({ key: item.key, label: item.label }));

  return (
    <aside style={{ width: isOpen ? 220 : 72, transition: "width 0.2s" }}>
      <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
    </aside>
  );
}
