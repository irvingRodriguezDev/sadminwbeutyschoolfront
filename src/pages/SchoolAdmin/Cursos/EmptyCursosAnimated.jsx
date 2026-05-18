import React from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

// 1. Animaciones CSS puras optimizadas para rendimiento por hardware
const pulseGlow = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(240, 98, 146, 0.4); }
  50% { transform: scale(1.03); box-shadow: 0 6px 25px 0 rgba(240, 98, 146, 0.7); }
  100% { transform: scale(1); box-shadow: 0 4px 14px 0 rgba(240, 98, 146, 0.4); }
`;

const floatIcon = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeInText = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
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
        py: 10,
        px: 3,
        mt: 4,
        borderRadius: 2,
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(240, 98, 146, 0.18)",
        animation: `${fadeInText} 0.8s ease-out`,
      }}
    >
      {/* Icono de Educación con rotación sutil infinita */}
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
          animation: `${floatIcon} 3.5s ease-in-out infinite`,
        }}
      >
        <SchoolIcon sx={{ fontSize: 40 }} />
      </Box>

      {/* Título con gradiente de color corporativo */}
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
        Expande tu conocimiento
      </Typography>

      <Typography
        variant='body1'
        color='textSecondary'
        mb={4}
        maxWidth={440}
        sx={{ lineHeight: 1.6, fontSize: "1.05rem" }}
      >
        Aún no has publicado ningún taller de Nail Art o aplicación de uñas.
        Crea tu primer programa educativo y compártelo con tus futuras alumnas.
      </Typography>

      {/* Botón de llamada a la acción */}
      <Link to={"/crear-curso-nuevo"}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={onNuevoCurso}
          sx={{
            bgcolor: "#f06292",
            borderRadius: "14px",
            px: 5,
            py: 1.8,
            mt: 2,
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1rem",
            animation: `${pulseGlow} 2.5s infinite ease-in-out`,
            "&:hover": {
              bgcolor: "#d81b60",
            },
          }}
        >
          Crear primer curso
        </Button>
      </Link>
    </Box>
  );
};

export default EmptyCursosAnimated;
