import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Container,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  School,
  Dashboard,
  Logout,
  MeetingRoom,
  Book,
  Group,
  MeetingRoomOutlined,
  BookOutlined,
  GroupAddOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext";
import StyledNavItem from "../components/common/SidebarItem";

const drawerWidth = 280;

const DashboardLayout = () => {
  const { profile } = useAuth(); // Aquí ya tenemos el rol (superadmin o school_admin)
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Definición de todos los items posibles
  const menuItems = [
    // Ítems para el SuperAdmin
    {
      label: "Global Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
      roles: ["superadmin"],
    },
    {
      label: "Escuelas",
      icon: <School />,
      path: "/escuelas",
      roles: ["superadmin"],
    },

    // Ítems para el Admin de Escuela
    {
      label: "Mi Academia",
      icon: <Dashboard />,
      path: "/dashboard",
      roles: ["school_admin"],
    },
    {
      label: "Salones",
      icon: <MeetingRoomOutlined />,
      path: "/salones",
      roles: ["school_admin"],
    },
    {
      label: "Cursos y Talleres",
      icon: <BookOutlined />,
      path: "/cursos",
      roles: ["school_admin"],
    },
    {
      label: "Inscripciones",
      icon: <GroupAddOutlined />,
      path: "/inscripciones",
      roles: ["school_admin"],
    },
  ];

  // FILTRADO DINÁMICO: Solo mostramos lo que corresponde al rol del perfil actual
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(profile?.rol),
  );

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const drawer = (
    <Box sx={{ p: 2, height: "100%", position: "relative" }}>
      <Toolbar>
        <Typography variant='h6' fontWeight='bold' sx={{ color: "#f06292" }}>
          EduAdmin Pro
        </Typography>
      </Toolbar>
      <Divider sx={{ my: 2, opacity: 0.5 }} />

      <List>
        {filteredMenuItems.map((item) => (
          <StyledNavItem
            key={item.label} // Corregido de item.text a item.label
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false); // Cierra el menú en móvil al clickear
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "#f06292" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label} // Corregido de item.text a item.label
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 700 : 500,
              }}
            />
          </StyledNavItem>
        ))}
      </List>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 16,
          width: "calc(100% - 32px)",
        }}
      >
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <StyledNavItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary='Cerrar Sesión' />
        </StyledNavItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fdf7f9" }}>
      {/* AppBar con efecto de cristal */}
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "rgba(252, 248, 250, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(240, 98, 146, 0.1)",
          color: "#424242",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color='inherit'
            edge='start'
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='body1' fontWeight={600} sx={{ color: "#444" }}>
            {location.pathname === "/dashboard"
              ? profile?.rol === "superadmin"
                ? "GLOBAL OVERVIEW"
                : "MI ACADEMIA"
              : location.pathname.replace("/", "").toUpperCase()}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}
            >
              <Typography variant='body2' fontWeight={700}>
                {profile?.nombre}
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: "#f06292", textTransform: "uppercase" }}
              >
                {profile?.rol === "superadmin"
                  ? "Super Administrador"
                  : "Gestor de Academia"}
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: "#f06292",
                width: 38,
                height: 38,
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(240, 98, 146, 0.3)",
              }}
            >
              {profile?.nombre?.charAt(0)}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navegación Lateral */}
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(15px)",
              borderRight: "1px solid rgba(240, 98, 146, 0.15)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Área de Contenido */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Espacio para el AppBar
        }}
      >
        <Container maxWidth='lg'>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
