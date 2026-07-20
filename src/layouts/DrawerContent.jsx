import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
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
import StyledNavItem from "../components/common/SidebarItem";
import { useNavigate } from "react-router-dom";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SummarizeIcon from "@mui/icons-material/Summarize";
const DrawerContent = ({
  LogoWapizima,
  handleDrawerToggle,
  handleLogout,
  isMobile,
  profile,
}) => {
  const navigate = useNavigate();
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
      label: "Gastos",
      icon: <CurrencyExchangeIcon />,
      path: "/Gastos",
      roles: ["school_admin"],
    },
    {
      label: "Reportes",
      icon: <SummarizeIcon />,
      path: "/Reportes",
      roles: ["school_admin"],
    },
    // {
    //   label: "Scanner",
    //   icon: <QrCodeScannerIcon />,
    //   path: "/scanner-asistencia",
    //   roles: ["school_admin"],
    // },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(profile?.rol),
  );

  return (
    <Box
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyBox: "space-between",
          px: [1],
        }}
      >
        <Typography
          variant='h6'
          fontWeight='bold'
          sx={{ color: "#f06292", ml: 1, width: "100%" }}
        >
          {profile?.rol === "superadmin" ? (
            <img
              src={LogoWapizima}
              width={"100%"}
              height={50}
              style={{ objectFit: "contain" }}
              alt='Wapizima Logo'
            />
          ) : (
            profile?.rol === "school_admin" && (
              <img
                src={profile.escuela?.logo_url}
                width={"100%"}
                height={50}
                style={{ objectFit: "contain" }}
                alt={`Logo academia ${profile?.escuela?.name}`}
              />
            )
          )}
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
            // disabled={!needsOnBoarding}
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
};

export default DrawerContent;
