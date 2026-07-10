import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar} aria-label="menu">
          <span style={{ fontSize: 20 }}>☰</span>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Biblioteca Virtual
        </Typography>

        <Box>
          <IconButton onClick={handleOpen} size="small">
            <Avatar src={`https://ui-avatars.com/api/?name=${user?.name ?? "User"}&background=9ca3af&color=fff&size=40`} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
            <MenuItem component={Link} to="/profile" onClick={handleClose}>Perfil</MenuItem>
            <MenuItem component={Link} to="/settings" onClick={handleClose}>Configuración</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
