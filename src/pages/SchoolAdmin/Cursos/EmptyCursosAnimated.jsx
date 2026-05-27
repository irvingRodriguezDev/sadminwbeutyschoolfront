import React from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // Icono de destellos premium ✨
import { Link } from "react-router-dom";

// 🌸 ANIMACIONES PREMIUM OPTIMIZADAS
const pulseGlowPremium = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 15px rgba(226, 32, 140, 0.2); }
  50% { transform: scale(1.02); box-shadow: 0 8px 25px rgba(226, 32, 140, 0.45); }
  100% { transform: scale(1); box-shadow: 0 4px 15px rgba(226, 32, 140, 0.2); }
`;

const floatIconPremium = keyframes`
  0% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 4px 6px rgba(226, 32, 140, 0.1)); }
  50% { transform: translateY(-10px) rotate(4deg); filter: drop-shadow(0 12px 12px rgba(226, 32, 140, 0.2)); }
  100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 4px 6px rgba(226, 32, 140, 0.1)); }
`;

const fadeInContainer = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(15px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const EmptyCursosAnimated = ({ onNuevoCurso }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: { xs: 8, md: 10 },
        px: 4,
        mt: 4,
        borderRadius: "24px", // Bordes más circulares y modernos
        width: "100%",
        // Fondo Glassmorphism ultra premium tirado a rosa pastel suave
        background:
          "linear-gradient(135deg, rgba(255, 249, 250, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(249, 196, 217, 0.4)",
        boxShadow: "0 10px 30px rgba(226, 32, 140, 0.03)",
        animation: `${fadeInContainer} 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {/* Contenedor del Icono con destellos mágicos */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 90,
          height: 90,
          borderRadius: "30px", // Cuadrado semi redondeado orgánico
          bgcolor: "#FDE7EF",
          color: "#E2208C",
          mb: 4,
          animation: `${floatIconPremium} 4s ease-in-out infinite`,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 42 }} />
      </Box>

      {/* Título elegante usando Playfair Display si la tienes mapeada, o una sans gruesa */}
      <Typography
        variant='h4'
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          background: "linear-gradient(90deg, #E2208C 0%, #BE3C77 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
          letterSpacing: "-0.5px",
        }}
      >
        Comienza a Diseñar el Futuro
      </Typography>

      <Typography
        variant='body1'
        sx={{
          lineHeight: 1.7,
          fontSize: "1.05rem",
          color: "#745E67", // Tono malva suave que combina perfecto con el rosa
          mb: 4,
          maxWidth: 460,
        }}
      >
        Tu catálogo de capacitación está esperando. Crea tu primer programa
        educativo de Nail Art y abre las puertas a tus futuras alumnas.
      </Typography>

      {/* 🚀 BOTÓN OPTIMIZADO: Inyectamos el Link directamente en el componente de MUI */}
      <Button
        component={Link}
        to='/crear-curso-nuevo'
        variant='contained'
        startIcon={<AddIcon />}
        onClick={onNuevoCurso}
        sx={{
          background: "linear-gradient(90deg, #E2208C 0%, #F06292 100%)",
          borderRadius: "14px",
          px: 5,
          py: 1.8,
          fontWeight: 700,
          textTransform: "none",
          fontSize: "1rem",
          letterSpacing: "0.3px",
          color: "#fff",
          boxShadow: "0 4px 15px rgba(226, 32, 140, 0.2)",
          animation: `${pulseGlowPremium} 3s infinite ease-in-out`,
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(90deg, #BE3C77 0%, #E2208C 100%)",
            transform: "translateY(-2px)",
          },
        }}
      >
        Crear primer curso
      </Button>
    </Box>
  );
};

export default EmptyCursosAnimated;
