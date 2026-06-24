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
const DrawerContent = ({
  LogoWapizima,
  handleDrawerToggle,
  filteredMenuItems,
  handleLogout,
  isMobile,
}) => {
  const navigate = useNavigate();
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
};

export default DrawerContent;
