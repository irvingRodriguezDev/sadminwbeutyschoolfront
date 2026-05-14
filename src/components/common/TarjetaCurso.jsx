import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import { Schedule, Person, LocationOn } from "@mui/icons-material";

const TarjetaCurso = ({ curso, onEdit, onDelete }) => {
  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2, // Bordes más suaves para look premium
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 24px rgba(240, 98, 146, 0.2)",
          },
        }}
      >
        {/* Imagen con Aspect Ratio controlado */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component='img'
            image={
              curso.flayer_url ||
              "https://via.placeholder.com/400x500?text=Sin+Flyer"
            }
            alt={curso.titulo}
            sx={{
              height: 240,
              objectFit: "cover",
            }}
          />
          {/* Badge Dinámico: Curso vs Taller */}
          <Chip
            label={curso.tipo_curso}
            size='small'
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: curso.tipo_curso === "Taller" ? "#ba68c8" : "#f06292",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ fontWeight: "bold", lineHeight: 1.2, mb: 1.5 }}
          >
            {curso.titulo}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            <Person sx={{ fontSize: 18, color: "#f06292" }} />
            <Typography variant='body2' color='text.secondary'>
              {curso.maestro}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <LocationOn sx={{ fontSize: 18, color: "#f06292" }} />
            <Typography variant='body2' color='text.secondary'>
              {curso.salon?.nombre || "Salón por definir"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: "text.disabled" }} />
              <Typography variant='caption' color='text.disabled'>
                {curso.fecha_inicio}
              </Typography>
            </Box>
            <Typography
              variant='h6'
              sx={{ fontWeight: "800", color: "#f06292" }}
            >
              ${curso.costo}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              pt: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              size='small'
              variant='outlined'
              color='info'
              onClick={() => onEdit(curso)}
            >
              Editar
            </Button>
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={() => onDelete(curso.id, curso.titulo)}
            >
              Eliminar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TarjetaCurso;
