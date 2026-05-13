import React from "react";
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import SchoolAdminDashboard from "./SchoolAdmin/SchoolAdminDashboard";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";
const DashboardRouter = () => {
  const { profile, loading } = useAuth();

  // Mientras el AuthContext verifica la sesión y el perfil
  if (loading) {
    return <LoadingScreen message='Cargando tu panel personalizado' />;
  }

  // Manejo de error si no se encuentra el perfil o el rol
  if (!profile || !profile.rol) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant='h6'>
          No se encontró un rol asignado a tu cuenta.
        </Typography>
        <Typography color='textSecondary'>
          Contacta al soporte técnico.
        </Typography>
      </Box>
    );
  }

  // El "Árbitro" decide qué dashboard mostrar
  return profile.rol === "superadmin" ? (
    <SuperAdminDashboard />
  ) : (
    <SchoolAdminDashboard />
  );
};

export default DashboardRouter;
