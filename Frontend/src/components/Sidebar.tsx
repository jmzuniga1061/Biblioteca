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
    { key: "/dashboard", label: <Link to="/dashboard">Inicio</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin"] },
    { key: "/books", label: <Link to="/books">Libros</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin"] },
    { key: "/loans", label: <Link to="/loans">Préstamos</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin"] },
    { key: "/authors", label: <Link to="/authors">Autores</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin"] },
    { key: "/categories", label: <Link to="/categories">Categorías</Link>, roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin"] },
    { key: "/users", label: <Link to="/users">Usuarios</Link>, roles: ["admin"] },
    { key: "/reports", label: <Link to="/reports">Reportes</Link>, roles: ["bibliotecario", "admin"] },
  ];

  const items = allItems.filter((item) => (role ? item.roles.includes(role) : false)).map((item) => ({ key: item.key, label: item.label }));

  return (
    <aside style={{ width: isOpen ? 220 : 72, transition: "width 0.2s" }}>
      <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
    </aside>
  );
}
