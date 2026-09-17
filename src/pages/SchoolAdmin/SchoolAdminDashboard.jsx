import React from "react";
import {
  Box,
  Grid,
  Typography,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useAdminSchool } from "../../context/AdminSchoolContext";
import LoadingScreen from "../../components/common/LoadingScreen";

import CardsDashboard from "../../components/common/AdminSchool/CardsDashboard";
import ActivitiesToday from "../../components/common/AdminSchool/ActivitiesToday";
import LatestInscriptions from "../../components/common/AdminSchool/LatestInscriptions";

const SchoolAdminDashboard = () => {
  const { profile } = useAuth();

  const {
    schoolData,
    metrics,
    actividadesHoy,
    ultimasInscripciones,
    loadingDashboard,
  } = useAdminSchool(profile?.school_id);

  if (loadingDashboard) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <LoadingScreen message='Preparando tu dashboard...' />
      </Box>
    );
  }

  // Nombre formateado para evitar huecos en blanco si no hay 4 nombres
  const primerNombre = profile?.name
    ? profile.name.split(" ")[0]
    : "Administrador";

  // Evaluar si es franquicia sin cuenta de Stripe vinculada
  const requiereStripe =
    schoolData?.is_franchise && !schoolData?.stripe_account_id;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Alerta si es Franquicia y no ha conectado Stripe */}
      {requiereStripe && (
        <Alert
          severity='warning'
          variant='filled'
          sx={{
            mb: 3,
            borderRadius: 3,
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(237, 108, 2, 0.2)",
          }}
          action={
            <Button
              color='inherit'
              size='small'
              variant='outlined'
              startIcon={<AccountBalanceWallet />}
              onClick={() => {
                // Redirigir a la vista de configuración/pagos de la escuela
                window.location.href = "/configuracion/pagos";
              }}
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                borderColor: "#fff",
                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Conectar Stripe
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: "bold" }}>
            Configuración de Pagos Pendiente
          </AlertTitle>
          Tu academia está registrada como franquicia. Debes vincular una cuenta
          de Stripe para procesar los cobros de tus inscripciones.
        </Alert>
      )}

      {/* Saludo Inicial */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='800' color='text.primary'>
          ¡Hola, {primerNombre}! 👋🏻
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Esto es lo que sucede hoy en {schoolData?.name || "tu institución"}.
        </Typography>
      </Box>

      {/* Fila de Estadísticas Rápidas */}
      <CardsDashboard metrics={metrics} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Próximas Clases / Talleres */}
        <ActivitiesToday actividadesHoy={actividadesHoy} />
        {/* Resumen de Alumnos Recientes */}
        <LatestInscriptions ultimasInscripciones={ultimasInscripciones} />
      </Grid>
    </Box>
  );
};

export default SchoolAdminDashboard;
