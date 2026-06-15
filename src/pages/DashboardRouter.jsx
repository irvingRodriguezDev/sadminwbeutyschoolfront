import React from "react";
import SuperAdminDashboard from "./SuperAdmin/SuperAdminDashboard";
import SchoolAdminDashboard from "./SchoolAdmin/SchoolAdminDashboard";
import SchoolAdminArea from "./SchoolAdmin/SchoolAdminArea"; // El nuevo componente que creamos
import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  if (loading) {
    return <LoadingScreen message='Cargando tu panel personalizado...' />;
  }

  if (!profile || !profile.rol) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant='h6' color='error'>
          No se encontró un rol asignado a tu cuenta.
        </Typography>
        <Typography color='textSecondary'>
          Contacta al soporte técnico si crees que esto es un error.
        </Typography>
        <Button onClick={handleLogout} variant='contained' sx={{ mt: 10 }}>
          Cerrar sesión
        </Button>
      </Box>
    );
  }

  // --- Lógica de Enrutamiento ---

  // 1. Si es SuperAdmin, entra directo (él no configura Stripe para sí mismo)
  if (profile.rol === "superadmin") {
    return <SuperAdminDashboard />;
  }

  // 2. Si es SchoolAdmin, lo mandamos al "Area" que controla el Onboarding
  if (profile.rol === "school_admin") {
    return <SchoolAdminArea userProfile={profile} />;
  }

  // Fallback por si acaso hay otros roles en el futuro
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography>Acceso no autorizado para este rol.</Typography>
    </Box>
  );
};

export default DashboardRouter;
