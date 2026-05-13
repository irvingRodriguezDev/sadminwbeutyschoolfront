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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard,
  School,
  Logout,
  MeetingRoomOutlined,
  BookOutlined,
  GroupAddOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext";
import StyledNavItem from "../components/common/SidebarItem";
import LogoWapizima from "../assets/logo_wapizima.webp";
// El ancho cuando está abierto
const drawerWidth = 280;

const DashboardLayout = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Ahora este estado controla ambos: el temporal en móvil y el persistente en desktop
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      label: "Dashboard",
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

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(profile?.rol),
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const drawerContent = (
    <Box
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
        }}
      >
        <Typography
          variant='h6'
          fontWeight='bold'
          sx={{ color: "#f06292", ml: 1 }}
        >
          <img src={LogoWapizima} width={"100%"} height={50} />
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider sx={{ my: 2, opacity: 0.5 }} />

      <List sx={{ flexGrow: 1 }}>
        {filteredMenuItems.map((item) => (
          <StyledNavItem
            key={item.label}
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setOpen(false);
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
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 700 : 500,
              }}
            />
          </StyledNavItem>
        ))}
      </List>

      <Box sx={{ pb: 2 }}>
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
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            ml: `${drawerWidth}px`,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          background: "rgba(252, 248, 250, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(240, 98, 146, 0.1)",
          color: "#424242",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerToggle}
              edge='start'
              sx={{
                mr: 2,
                ...(open && { display: { xs: "block", sm: "none" } }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='body1' fontWeight={600} sx={{ color: "#444" }}>
              {location.pathname === "/dashboard"
                ? profile?.rol === "superadmin"
                  ? "Panel Super administrador"
                  : "MI ACADEMIA"
                : location.pathname.replace("/", "").toUpperCase()}
            </Typography>
          </Box>

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
            {/* <Avatar sx={{ bgcolor: "#f06292", width: 38, height: 38 }}>
              {profile?.nombre?.charAt(0)}
            </Avatar> */}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component='nav'
        sx={{
          width: { sm: open ? drawerWidth : 0 },
          flexShrink: { sm: 0 },
          transition: "width 0.3s",
        }}
      >
        {/* Móvil */}
        <Drawer
          variant='temporary'
          open={open && isMobile}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Colapsable */}
        <Drawer
          variant='persistent'
          open={open}
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
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: 8,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ml: { sm: 0 }, // Ajuste opcional para no empujar el contenido bruscamente
          }),
        }}
      >
        <Container maxWidth='2xl'>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
