import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

const SalonCard = ({ salon, handleAbrirEditor, handleDeleteSalon, index }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }} key={index}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "0 0 16px 16px",
            border: "1px solid rgba(0, 0, 0, 0.07)",
            bgcolor: "#fff",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              boxShadow: "0 12px 30px rgba(240, 98, 146, 0.06)",
              borderColor: "rgba(240, 98, 146, 0.35)",
            },
          }}
        >
          {/* LÍNEA DETALLE SUPERIOR DE MARCA */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgcolor: "#f06292",
              borderRadius: "16px 16px 0 0",
            }}
          />

          {/* CUERPO DEL ENCABEZADO SUPERIOR */}
          <Stack
            direction='row'
            // Alineación perfecta de la línea de los iconos
            sx={{
              mb: 3,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* ICONO + TEXTOS */}
            <Stack
              direction='row'
              spacing={1.8}
              sx={{ overflow: "hidden", flexGrow: 1, alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: "rgba(240, 98, 146, 0.08)",
                  color: "#d81b60",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MeetingRoomRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 800,
                    color: "#1a1a1a",
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                    noWrap: true,
                  }}
                >
                  {salon.nombre}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  ID: {salon.id.toString().substring(0, 8).toUpperCase()}
                </Typography>
              </Box>
            </Stack>

            {/* BOTÓN DE MENÚ CON TAMAÑO NORMALIZADO */}
            <Box sx={{ flexShrink: 0, ml: 1 }}>
              <IconButton
                size='small'
                onClick={handleOpenMenu}
                sx={{
                  color: "text.secondary",
                  bgcolor: "rgba(0,0,0,0.02)",
                  "&:hover": {
                    bgcolor: "rgba(240, 98, 146, 0.08)",
                    color: "#d81b60",
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    minWidth: 130,
                    mt: 0.5,
                    p: 0.5,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    handleAbrirEditor(salon);
                  }}
                  sx={{ py: 1, borderRadius: "8px", color: "#444" }}
                >
                  <ListItemIcon
                    sx={{ color: "info.main", minWidth: "28px !important" }}
                  >
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Editar'
                    // primaryTypographyProps={{
                    //   variant: "body2",
                    //   fontWeight: 700,
                    // }}
                  />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    handleDeleteSalon(salon.id);
                  }}
                  sx={{ py: 1, borderRadius: "8px", color: "error.main" }}
                >
                  <ListItemIcon
                    sx={{ color: "error.main", minWidth: "28px !important" }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Eliminar'
                    // primaryTypographyProps={{
                    //   variant: "body2",
                    //   fontWeight: 700,
                    // }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Stack>

          {/* SECCIÓN MÉTRIQUES: DISEÑO COMPACTO DE DASHBOARD INDUSTRIAL */}
          <Stack
            direction='row'
            sx={{
              justifyContent: "space-between",
              p: 1.8,
              borderRadius: "12px",
              bgcolor: "rgba(0, 0, 0, 0.015)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <Stack direction='row' spacing={1}>
              <GroupsRoundedIcon
                sx={{ color: "text.secondary", fontSize: 18 }}
              />
              <Typography
                variant='body2'
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Aforo máximo
              </Typography>
              <Chip
                label={`${salon.capacidad} Alumnas`}
                size='large'
                sx={{
                  bgcolor:
                    salon.capacidad > 20
                      ? "rgba(240, 98, 146, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  color: salon.capacidad > 20 ? "#d81b60" : "#222",
                  fontWeight: "800",
                  fontSize: "0.75rem",
                  borderRadius: "8px",

                  border:
                    salon.capacidad > 20
                      ? "1px solid rgba(240, 98, 146, 0.15)"
                      : "none",
                }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Grid>
  );
};

export default SalonCard;
