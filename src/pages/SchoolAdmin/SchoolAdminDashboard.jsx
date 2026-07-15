import { Box, Grid, Typography } from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import { useAdminSchool } from "../../context/AdminSchoolContext";
import LoadingScreen from "../../components/common/LoadingScreen";

import CardsDashboard from "../../components/common/AdminSchool/CardsDashboard";
import ActivitiesToday from "../../components/common/AdminSchool/ActivitiesToday";
import LatestInscriptions from "../../components/common/AdminSchool/LatestInscriptions";
// Reutilizamos una versión local del StatCard para mantener el estilo

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
        <LoadingScreen message='Preparando tu dashboard' />
      </Box>
    );
  }
  console.log(actividadesHoy, "las actividades de hoy");

  return (
    <Box>
      {/* Saludo Inicial */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' color='#333'>
          ¡Hola, {profile?.name?.split(" ")[1]} {profile?.name?.split(" ")[2]}{" "}
          {profile?.name?.split(" ")[3]} {profile?.name?.split(" ")[4]} ! 👋🏻
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Esto es lo que sucede hoy en tu institución.
        </Typography>
      </Box>

      {/* Fila de Estadísticas Rápidas */}
      <CardsDashboard metrics={metrics} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Próximas Clases / Talleres */}
        <ActivitiesToday actividadesHoy={actividadesHoy} />
        {/* Resumen de Alumnos Recientes */}
        <LatestInscriptions ultimasInscripciones={ultimasInscripciones} />
      </Grid>
    </Box>
  );
};

export default SchoolAdminDashboard;
