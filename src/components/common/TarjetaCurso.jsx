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
import LogoWapizima from "../../assets/logo_wapizima.webp";

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
      whileHover={{ y: -6 }} // Subimos un pelín más el hover para dar más sensación de flotado
      sx={{ height: "100%" }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px", // Esquinas ligeramente más suaves
          border: "1px solid rgba(240, 98, 146, 0.15)", // Borde suave tonal desde el inicio
          bgcolor: "#fff",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(240, 98, 146, 0.08)",
            borderColor: "rgba(240, 98, 146, 0.4)",
          },
        }}
      >
        {/* IMAGEN DE PORTADA / FLYER */}
        <Box
          sx={{
            position: "relative",
            height: 190,
            bgcolor: "#fdf2f5",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component='img'
            image={curso.flayer_url || LogoWapizima}
            alt={curso.titulo}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              "PerspectiveCard-root:hover &": {
                transform: "scale(1.03)", // Pequeño efecto zoom en el flyer al hacer hover a la tarjeta
              },
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
              letterSpacing: "0.8px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
                backdropFilter: "blur(4px)",
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
                  borderRadius: "12px",
                  border: "1px solid rgba(240, 98, 146, 0.12)",
                  boxShadow: "0 4px 20px rgba(240, 98, 146, 0.08)",
                  minWidth: 130,
                  p: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onEdit(curso);
                }}
                sx={{ py: 0.8, borderRadius: "8px", gap: 1 }}
              >
                <ListItemIcon
                  sx={{ color: "info.main", minWidth: "auto !important" }}
                >
                  <EditRoundedIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Editar'
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onDelete(curso.id, curso.titulo);
                }}
                sx={{
                  py: 0.8,
                  borderRadius: "8px",
                  color: "error.main",
                  gap: 1,
                }}
              >
                <ListItemIcon
                  sx={{ color: "error.main", minWidth: "auto !important" }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText
                  primary='Eliminar'
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* CUERPO DE CONTENIDO */}
        <CardContent
          sx={{
            p: 2.5,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* TÍTULO DEL CURSO */}
          <Typography
            variant='body1'
            sx={{
              fontWeight: 800,
              color: "#1a1a1a",
              lineHeight: 1.35,
              letterSpacing: "-0.2px",
              minHeight: "2.7em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {curso.titulo}
          </Typography>

          {/* DATOS TÉCNICOS: MAESTRO Y SALÓN CON TOQUE EDITORIAL */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  p: 0.6,
                  borderRadius: "6px",
                  bgcolor: "#fdf2f5",
                  color: "#f06292",
                }}
              >
                <PersonRoundedIcon sx={{ fontSize: 15 }} />
              </Box>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight='600'
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {curso.maestro}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  p: 0.6,
                  borderRadius: "6px",
                  bgcolor: "#f3e5f5",
                  color: "#ba68c8",
                }}
              >
                <MeetingRoomRoundedIcon sx={{ fontSize: 15 }} />
              </Box>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight='600'
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {curso.salon?.nombre || "Salón por definir"}
              </Typography>
            </Box>
          </Box>

          {/* DIVIDER DEGRADADO SUTIL */}
          <Divider
            sx={{
              mt: "auto",
              pt: 0.5,
              borderBottomWidth: 1,
              background:
                "linear-gradient(90deg, rgba(240,98,146,0.3) 0%, rgba(240,98,146,0.05) 100%)",
              borderBottom: "none",
            }}
          />

          {/* FOOTER: FECHA Y PRECIO */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 15, color: "text.disabled" }}
              />
              <Typography
                variant='caption'
                sx={{ color: "text.secondary", fontWeight: 700 }}
              >
                {curso.fecha_inicio}
                {curso.tipo_curso === "Curso" ? ` al ${curso.fecha_fin}` : ""}
              </Typography>
            </Box>

            <Typography
              variant='h6'
              sx={{
                fontWeight: 900,
                color: "#d81b60",
                letterSpacing: "-0.5px",
                fontSize: "1.15rem",
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
