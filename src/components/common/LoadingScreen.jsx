import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

const LoadingScreen = ({ message = "Cargando aplicación..." }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #fdf7f9 0%, #fce4ec 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Stack
        spacing={3}
        alignItems='center'
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contenedor del Spinner con efecto de pulso */}
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant='indeterminate'
            size={60}
            thickness={4}
            sx={{
              color: "#f06292",
              animationDuration: "550ms",
              strokeLinecap: "round",
            }}
          />
          <CircularProgress
            variant='determinate'
            value={100}
            size={60}
            thickness={4}
            sx={{
              color: "rgba(240, 98, 146, 0.1)",
              position: "absolute",
              left: 0,
            }}
          />
        </Box>

        {/* Texto Dinámico */}
        <Typography
          variant='h6'
          sx={{
            color: "#444",
            fontWeight: 500,
            letterSpacing: "0.5px",
            textAlign: "center",
            textTransform: "lowercase",
            "&::first-letter": {
              textTransform: "uppercase",
            },
          }}
        >
          {message}
        </Typography>

        {/* Decoración sutil */}
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: "#f06292",
            opacity: 0.3,
          }}
        />
      </Stack>
    </Box>
  );
};

export default LoadingScreen;
