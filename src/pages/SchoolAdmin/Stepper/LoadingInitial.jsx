import React from "react";
import BuildWebSiteSvg from "../../../assets/build_website.svg";
import { Box, Typography } from "@mui/material";
const LoadingInitial = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        p: 4,
        animation: "fadeIn 0.5s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Spinner concéntrico doble estilo Premium SaaS */}
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          mb: 4,
          width: "100%",
          maxWidth: 280,
        }}
      >
        <img
          src={BuildWebsiteSvg}
          alt='Preparando sitio'
          style={{ width: "100%", height: "auto" }}
        />
      </Box>

      <Typography
        variant='h5'
        sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1 }}
      >
        Estamos preparando tu experiencia
      </Typography>

      <Typography
        variant='body2'
        sx={{ color: "text.secondary", maxWidth: 360, lineHeight: 1.6 }}
      >
        Configurando salones virtuales, pasarelas de pago y tu nueva identidad
        de marca. Tardará solo unos segundos...
      </Typography>
    </Box>
  );
};

export default LoadingInitial;
