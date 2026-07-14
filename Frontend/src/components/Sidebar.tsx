import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  TagsOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const allItems = [
    {
      key: "/dashboard",
      label: <Link to="/dashboard">Inicio</Link>,
      icon: <HomeOutlined />,
      roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"],
    },
    {
      key: "/books",
      label: <Link to="/books">Libros</Link>,
      icon: <BookOutlined />,
      roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"],
    },
    {
      key: "/loans",
      label: <Link to="/loans">Préstamos</Link>,
      icon: <CalendarOutlined />,
      roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"],
    },
    {
      key: "/authors",
      label: <Link to="/authors">Autores</Link>,
      icon: <UserOutlined />,
      roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"],
    },
    {
      key: "/categories",
      label: <Link to="/categories">Categorías</Link>,
      icon: <TagsOutlined />,
      roles: ["cliente", "estudiante", "bibliotecario", "profesor", "admin", "administrador", "subadministrador"],
    },
    {
      key: "/users",
      label: <Link to="/users">Usuarios</Link>,
      icon: <TeamOutlined />,
      roles: ["admin", "administrador", "subadministrador"],
    },
    {
      key: "/reports",
      label: <Link to="/reports">Reportes</Link>,
      icon: <BarChartOutlined />,
      roles: ["bibliotecario", "admin", "administrador", "subadministrador"],
    },
  ];

  const items = allItems
    .filter((item) => {
      if (!role) {
        return item.key === "/dashboard";
      }
      return item.roles.map(r => r.toLowerCase()).includes(role.toLowerCase());
    })
    .map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
    }));

  return (
    <Sider
      collapsible
      collapsed={!isOpen}
      trigger={null}
      width={220}
      collapsedWidth={80}
      theme="light"
      style={{
        borderRight: "1px solid #f0f0f0",
        background: "#ffffff",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ height: "100%", borderRight: 0 }}
      />
    </Sider>
  );
}
