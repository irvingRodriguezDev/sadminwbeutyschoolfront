import React from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StorefrontIcon from "@mui/icons-material/Storefront";

// 1. Definimos las animaciones con CSS puro (keyframes)
const pulseGlow = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(240, 98, 146, 0.4); }
  50% { transform: scale(1.03); box-shadow: 0 6px 25px 0 rgba(240, 98, 146, 0.7); }
  100% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(240, 98, 146, 0.4); }
`;

const floatIcon = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const EmptySalonesAnimated = ({ onNuevoSalon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 10,
        px: 3,
        mt: 4,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(240, 98, 146, 0.18)",
        animation: `${fadeInText} 0.8s ease-out`,
        width: "100%",
      }}
    >
      {/* Icono de MUI Animado (Sustituye a la imagen pesada) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(240, 98, 146, 0.1)",
          color: "#f06292",
          mb: 3,
          animation: `${floatIcon} 3s ease-in-out infinite`,
        }}
      >
        <StorefrontIcon sx={{ fontSize: 40 }} />
      </Box>

      {/* Texto Animado / Tipografía Premium */}
      <Typography
        variant='h4'
        fontWeight='800'
        sx={{
          background: "linear-gradient(45deg, #d81b60 30%, #f06292 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
          letterSpacing: "-0.5px",
        }}
      >
        Diseña tu espacio
      </Typography>

      <Typography
        variant='body1'
        color='textSecondary'
        mb={4}
        sx={{ lineHeight: 1.6, fontSize: "1.05rem" }}
      >
        Tu catálogo de salones está listo para cobrar vida. Registra tu primer
        centro de capacitación y comienza a organizar tus grupos.
      </Typography>

      {/* Botón con efecto de pulso */}
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={onNuevoSalon}
        sx={{
          mt: 2,
          bgcolor: "#f06292",
          borderRadius: "14px",
          px: 5,
          py: 1.8,
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "1rem",
          animation: `${pulseGlow} 2.5s infinite ease-in-out`,
          "&:hover": {
            bgcolor: "#d81b60",
          },
        }}
      >
        Crear mi primer salón
      </Button>
    </Box>
  );
};

export default EmptySalonesAnimated;
