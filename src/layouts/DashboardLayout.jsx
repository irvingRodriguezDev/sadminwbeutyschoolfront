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
  Settings,
  Logout,
} from "@mui/icons-material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext";
import StyledNavItem from "../components/common/SidebarItem";
const drawerWidth = 280;

const DashboardLayout = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Panel Principal", icon: <Dashboard />, path: "/dashboard" },
    { text: "Escuelas", icon: <School />, path: "/escuelas" },
    { text: "Configuración", icon: <Settings />, path: "/configuracion" },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpiamos cualquier rastro y al login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };
  const drawer = (
    <Box sx={{ p: 2 }}>
      <Toolbar>
        <Typography variant='h6' fontWeight='bold' color='primary'>
          EduAdmin Pro
        </Typography>
      </Toolbar>
      <Divider sx={{ my: 2, opacity: 0.5 }} />

      <List>
        {menuItems.map((item) => (
          <StyledNavItem
            key={item.text}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </StyledNavItem>
        ))}
      </List>

      <Box
        sx={{ position: "absolute", bottom: 20, width: "calc(100% - 32px)" }}
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
          borderBottom: "1px solid rgba(0,0,0,0.05)",
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
          <Typography variant='body1' fontWeight={500}>
            {location.pathname.replace("/", "").toUpperCase() || "DASHBOARD"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant='body2'
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {profile?.nombre} ({profile?.rol})
            </Typography>
            <Avatar sx={{ bgcolor: "primary.main", width: 35, height: 35 }}>
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
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid rgba(240, 98, 146, 0.1)",
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
          mt: 8,
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
