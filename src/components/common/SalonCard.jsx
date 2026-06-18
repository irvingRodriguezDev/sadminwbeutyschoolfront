import React, { useState } from "react";
// Importación estricta de Grid2 como Grid para el estándar del proyecto
import {
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";

// Iconografía Editorial
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
const SalonCard = ({
  salon,
  index,
  handleAbrirEditor,
  handleDeleteSalon,
  handleOpenCursosAsignados,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Paleta de color premium consistente con la marca
  const COLORS = {
    primary: "#E91E63",
    accent: "#F06292",
    darkText: "#2A2628",
    softBg: "rgba(240, 98, 146, 0.05)",
  };

  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 }, // Padding responsivo para pantallas pequeñas
          borderRadius: "24px", // Bordes suaves y modernos continuos
          border: "1px solid rgba(223, 34, 138, 0.08)",
          bgcolor: "#FFFFFF",
          position: "relative",
          overflow: "hidden", // Asegura que la línea superior respete el redondeado de la card
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0px 8px 24px rgba(42, 36, 38, 0.02)",
          "&:hover": {
            boxShadow: "0px 20px 40px rgba(223, 34, 138, 0.06)",
            borderColor: "rgba(223, 34, 138, 0.25)",
          },
        }}
      >
        {/* LÍNEA DETALLE SUPERIOR DE MARCA ENMARCADA PERFECTAMENTE */}
        <Grid
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
          }}
        />

        {/* CUERPO DEL ENCABEZADO SUPERIOR */}
        <Stack
          direction='row'
          spacing={1}
          sx={{
            mb: 3,
            pt: 0.5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* ICONO + TEXTOS */}
          <Stack
            direction='row'
            spacing={1.8}
            sx={{
              overflow: "hidden",
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <Grid
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                bgcolor: COLORS.softBg,
                color: COLORS.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                display: { xs: "none", md: "flex" },
              }}
            >
              <MeetingRoomRoundedIcon sx={{ fontSize: 22 }} />
            </Grid>

            <Grid sx={{ overflow: "hidden", width: "100%" }}>
              <Typography
                variant='body1'
                noWrap // Sustituye de forma correcta a noWrap: true que fallaba en la API interna de MUI
                sx={{
                  fontWeight: 800,
                  color: COLORS.darkText,
                  lineHeight: 1.3,
                  letterSpacing: "-0.3px",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {salon.nombre}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: "#8A8487",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                ID: {salon.id.toString().substring(0, 8).toUpperCase()}
              </Typography>
            </Grid>
          </Stack>

          {/* BOTÓN DE MENÚ CON ACCIONES ACCESIBLES */}
          <Grid sx={{ flexShrink: 0 }}>
            <IconButton
              size='small'
              onClick={handleOpenMenu}
              sx={{
                color: "#8A8487",
                backgroundColor: "rgba(0,0,0,0.02)",
                "&:hover": {
                  bgcolor: COLORS.softBg,
                  color: COLORS.primary,
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
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: "0px 12px 32px rgba(42, 36, 38, 0.08)",
                    minWidth: 140,
                    mt: 0.5,
                    p: 0.5,
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleAbrirEditor(salon);
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                <ListItemIcon
                  sx={{ color: "info.main", minWidth: "28px !important" }}
                >
                  <EditRoundedIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary='Editar' />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleOpenCursosAsignados(salon.id);
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                <ListItemIcon
                  sx={{ color: "success.main", minWidth: "28px !important" }}
                >
                  <AssignmentIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary='Cursos Asignados' />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  handleDeleteSalon(salon.id);
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "10px",
                  color: "error.main",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                <ListItemIcon
                  sx={{ color: "error.main", minWidth: "28px !important" }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText primary='Eliminar' />
              </MenuItem>
            </Menu>
          </Grid>
        </Stack>

        {/* SECCIÓN MÉTRICAS: AUTO-RESPONSIVA PARA MÓVILES (FLEX-WRAP) */}
        <Stack
          direction={{ xs: "column", sm: "row" }} // Se apila en vertical en teléfonos muy pequeños
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            p: 2,
            borderRadius: "16px",
            bgcolor: "rgba(223, 34, 138, 0.015)",
            border: "1px solid rgba(223, 34, 138, 0.04)",
          }}
        >
          <Stack direction='row' spacing={1} sx={{ alignItems: "center" }}>
            <GroupsRoundedIcon sx={{ color: "#8A8487", fontSize: 18 }} />
            <Typography
              variant='body2'
              sx={{
                color: COLORS.darkText,
                fontWeight: 600,
                fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Aforo máximo
            </Typography>
          </Stack>

          <Chip
            label={`${salon.capacidad} Alumnas`}
            size='medium'
            sx={{
              bgcolor:
                salon.capacidad > 20
                  ? "rgba(223, 34, 138, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              color: salon.capacidad > 20 ? COLORS.primary : COLORS.darkText,
              fontWeight: "800",
              fontSize: "0.75rem",
              borderRadius: "10px",
              fontFamily: "'Montserrat', sans-serif",
              alignSelf: { xs: "flex-end", sm: "auto" }, // En móvil tira el chip a la derecha
              border:
                salon.capacidad > 20
                  ? "1px solid rgba(223, 34, 138, 0.12)"
                  : "none",
            }}
          />
        </Stack>
      </Paper>
    </Grid>
  );
};

export default SalonCard;
