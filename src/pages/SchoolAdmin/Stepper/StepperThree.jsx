import { Box, Typography } from "@mui/material";
import React from "react";

const StepperThree = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1,
        py: 3,
      }}
    >
      <Typography variant='h6' sx={{ fontWeight: 800, color: "#1a1a1a" }}>
        ¡Todo Listo para el Lanzamiento!
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 400 }}>
        La identidad corporativa, coordenadas de mapas y cuenta bancaria se han
        unificado correctamente.
      </Typography>
    </Box>
  );
};

export default StepperThree;
