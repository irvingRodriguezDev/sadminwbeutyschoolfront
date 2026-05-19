import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";

const TarjetaCurso = ({ curso, onEdit, onDelete, index }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(precio);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      sx={{ height: "100%" }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "14px",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          bgcolor: "#fff",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(240, 98, 146, 0.05)",
            borderColor: "rgba(240, 98, 146, 0.3)",
          },
        }}
      >
        {/* IMAGEN DE PORTADA / FLYER */}
        <Box sx={{ position: "relative", height: 180, bgcolor: "#fdf2f5" }}>
          <CardMedia
            component='img'
            image={
              curso.flayer_url ||
              "https://via.placeholder.com/400x500?text=Sin+Flyer"
            }
            alt={curso.titulo}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />

          {/* BADGE TIPO DE CURSO */}
          <Chip
            label={curso.tipo_curso?.toUpperCase()}
            size='small'
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: curso.tipo_curso === "Taller" ? "#ba68c8" : "#f06292",
              color: "white",
              fontWeight: "800",
              fontSize: "0.65rem",
              letterSpacing: "0.5px",
              borderRadius: "6px",
            }}
          />

          {/* ACCIONES DEL ADMINISTRADOR */}
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <IconButton
              size='small'
              onClick={handleOpenMenu}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.9)",
                color: "#1a1a1a",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                "&:hover": { bgcolor: "#fff", color: "#d81b60" },
              }}
            >
              <MoreVertIcon sx={{ fontSize: 18 }} />
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
                  borderRadius: "10px",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  minWidth: 120,
                  p: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onEdit(curso);
                }}
                sx={{ py: 0.8, borderRadius: "6px" }}
              >
                <ListItemIcon
                  sx={{ color: "info.main", minWidth: "26px !important" }}
                >
                  <EditRoundedIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Editar'
                  // primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onDelete(curso.id, curso.titulo);
                }}
                sx={{ py: 0.8, borderRadius: "6px", color: "error.main" }}
              >
                <ListItemIcon
                  sx={{ color: "error.main", minWidth: "26px !important" }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Eliminar'
                  // primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* CUERPO DE CONTENIDO CON FLEXBOX DIRECTO */}
        <CardContent
          sx={{
            p: 2.5,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5, // El secreto: controla la separación vertical uniforme de todo el bloque sin envolver en Stacks
          }}
        >
          {/* TÍTULO DEL CURSO */}
          <Typography
            variant='body1'
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              lineHeight: 1.3,
              letterSpacing: "-0.2px",
              minHeight: "2.6em", // Asegura que conserve el espacio si el texto ocupa 1 o 2 líneas
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {curso.titulo}
          </Typography>

          {/* DATOS TÉCNICOS: MAESTRO Y SALÓN */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <PersonRoundedIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight='500'
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {curso.maestro}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <MeetingRoomRoundedIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight='500'
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {curso.salon?.nombre || "Salón por definir"}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{ mt: "auto", pt: 1, borderColor: "rgba(0,0,0,0.05)" }}
          />

          {/* FOOTER: FECHA Y PRECIO */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 14, color: "text.disabled" }}
              />
              <Typography
                variant='caption'
                sx={{ color: "text.disabled", fontWeight: 600 }}
              >
                {curso.fecha_inicio}
              </Typography>
            </Box>

            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 900,
                color: "#d81b60",
                letterSpacing: "-0.5px",
              }}
            >
              {formatPrecio(curso.costo)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TarjetaCurso;
