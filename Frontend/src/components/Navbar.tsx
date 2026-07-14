import { Link, useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, Space, Button } from "antd";
import { MenuOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDisplayName = () => {
    if (!user) return "Usuario";
    if (user.name === "Administrador por Defecto" || user.name === "Administrador por defecto" || user.name === "Administrador") {
      return "Administrador";
    }
    return user.name;
  };

  const displayName = getDisplayName();

  const menuItems = [
    {
      key: "profile",
      label: <Link to="/profile">Perfil</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: <Link to="/settings">Configuración</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "logout",
      label: "Cerrar sesión",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ background: "#white", backgroundColor: "#ffffff", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0", height: "64px" }}>
      <Space>
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={toggleSidebar} 
          style={{ fontSize: "16px", width: 64, height: 64 }} 
        />
        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#1f1f1f" }}>
          Biblioteca Virtual
        </span>
      </Space>

      {user ? (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#555", fontWeight: 500 }}>{displayName}</span>
            <Avatar 
              size={40} 
              src={`https://ui-avatars.com/api/?name=${displayName}&background=1890ff&color=fff&size=40`} 
            />
          </div>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={() => navigate("/login")}>
          Iniciar sesión
        </Button>
      )}
    </Header>
  );
}
