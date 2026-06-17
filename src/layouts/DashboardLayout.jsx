import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
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
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "../context/AuthContext";
import StyledNavItem from "../components/common/SidebarItem";
import LogoWapizima from "../assets/logo_wapizima.webp";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// El ancho cuando está abierto el menú lateral
const drawerWidth = 280;

const DashboardLayout = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [needsOnBoarding, setNeedsOnBoarding] = useState(() => {
    const savedValue = localStorage.getItem("needsOnBoarding");
    if (savedValue === null) return true;
    return savedValue === "true";
  });

  // Estado que controla la apertura del panel de navegación
  const [open, setOpen] = useState(false); // Cambiado a true por defecto para una carga más fluida en desktop

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleCompleteOnboarding = () => {
    setNeedsOnBoarding(false); // Apaga el bloqueo del Onboarding
    setOpen(true); // 🚀 Ejecuta la animación de apertura del menú AQUÍ Y SÓLO AQUÍ
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
    {
      label: "Finanzas",
      icon: <RequestQuoteIcon />,
      path: "/finanzas",
      roles: ["school_admin"],
    },
    {
      label: "Scanner",
      icon: <QrCodeScannerIcon />,
      path: "/scanner-asistencia",
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
          sx={{ color: "#f06292", ml: 1, width: "100%" }}
        >
          <img
            src={LogoWapizima}
            width={"100%"}
            height={50}
            style={{ objectFit: "contain" }}
            alt='Wapizima Logo'
          />
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
            <ListItemText primary={item.label} />
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
          ...(open &&
            !isMobile && {
              ml: `${drawerWidth}px`,
              width: `calc(100% - ${drawerWidth}px)`,
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
            {needsOnBoarding === false && (
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerToggle}
                edge='start'
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant='body1' fontWeight={600} sx={{ color: "#444" }}>
              {location.pathname === "/dashboard"
                ? profile?.rol === "superadmin"
                  ? "Panel Super Administrador"
                  : profile?.name
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
                  : "Administrador de Academia"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component='nav'
        sx={{
          width: { sm: open ? drawerWidth : 0 },
          flexShrink: { sm: 0 },
          transition: "width 0.3s ease",
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
          open={open && !isMobile}
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

      {/* 🌟 CONTENIDO PRINCIPAL: Ajustado con animaciones fluidas alineadas al AppBar */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: 8,
          minHeight: "calc(100vh - 64px)",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(!isMobile &&
            open && {
              width: `calc(100% - ${drawerWidth}px)`,
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
        }}
      >
        <Container maxWidth='2xl'>
          <Outlet context={{ handleCompleteOnboarding }} />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
