import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Grid,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/material";

import { useReports } from "../../../context/ReportsContext";
import { useAuth } from "../../../context/AuthContext";
import PanelSelector from "./PanelSelector";
import KpisInformativos from "./KpisInformativos";
import ViewPreview from "./ViewPreview";
import { TrendingUp } from "@mui/icons-material";

const GestionReportes = () => {
  const { profile } = useAuth();

  const {
    courses,
    selectedCourseReport,
    loadingReport,
    loadingCourses,
    fetchCoursesList,
    fetchUtilityReport,
    clearReport,
  } = useReports();

  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Cargar lista de cursos de la academia al montar el componente
  useEffect(() => {
    if (profile?.school_id) {
      fetchCoursesList(profile.school_id);
    }
    return () => clearReport(); // Limpiar el reporte si se sale de la pantalla
  }, [profile, fetchCoursesList, clearReport]);

  // Manejar el cambio de curso
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    if (courseId) {
      fetchUtilityReport(courseId);
    } else {
      clearReport();
    }
  };

  // Obtener el nombre del curso seleccionado de manera local
  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  // 2. Extraemos el título de manera segura
  const selectedCourseName = currentCourse?.titulo || "Curso";

  // 3. Extraemos el nombre del maestro de manera segura
  const selectedTeacherName = currentCourse?.maestro || "No asignado";

  return (
    <Grid container spacing={2}>
      {/* Cabecera Principal */}
      <Grid size={12}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant='h4'
            fontWeight={800}
            sx={{ color: "#2A2628", fontFamily: "'Montserrat', sans-serif" }}
          >
            Centro de Reportes Financieros
          </Typography>
          <Typography variant='body2' sx={{ color: "#6B6567" }}>
            Analiza y exporta la rentabilidad neta de tus cursos operativos de
            manera inmediata.
          </Typography>
        </Box>
      </Grid>

      {/* PANEL DE CONTROL / SELECTOR */}
      <Grid size={12}>
        <PanelSelector
          selectedCourseId={selectedCourseId}
          handleCourseChange={handleCourseChange}
          loadingCourses={loadingCourses}
          courses={courses}
          selectedCourseReport={selectedCourseReport}
          loadingReport={loadingReport}
          selectedCourseName={selectedCourseName}
          selectedTeacherName={selectedTeacherName}
          logo={profile ? profile.escuela?.logo_url : null}
        />
      </Grid>

      {/* VISTA PREVIA INTERACTIVA (PREVIEW CARD) */}
      <Grid size={12}>
        {loadingReport ? (
          // Skeleton de carga premium
          <Card sx={{ borderRadius: "24px", p: 3 }}>
            <Skeleton variant='text' width='60%' height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[1, 2, 3].map((n) => (
                <Grid size={{ xs: 12, md: 4 }} key={n}>
                  <Skeleton
                    variant='rectangular'
                    height={100}
                    sx={{ borderRadius: "16px" }}
                  />
                </Grid>
              ))}
            </Grid>
            <Skeleton
              variant='rectangular'
              height={200}
              sx={{ borderRadius: "16px" }}
            />
          </Card>
        ) : selectedCourseReport ? (
          // Panel de Resultados Renderizados
          <Box>
            {/* Tarjetas de KPIs Rápidos */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <KpisInformativos selectedCourseReport={selectedCourseReport} />
            </Grid>

            {/* Vista previa de estudiantes cargados */}
            <ViewPreview selectedCourseReport={selectedCourseReport} />
          </Box>
        ) : (
          // Mensaje de estado inicial limpio y refinado
          <Card
            sx={{
              borderRadius: "24px",
              border: "2px dashed rgba(0,0,0,0.05)",
              bgcolor: "#FAFAFA",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 6,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "50%",
                  bgcolor: "#FFFFFF",
                  color: "#6B6567",
                  display: "inline-flex",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.02)",
                  mb: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant='h6'
                fontWeight={700}
                color='#2A2628'
                sx={{ mb: 1 }}
              >
                Sin Datos Seleccionados
              </Typography>
              <Typography
                variant='body2'
                color='#6B6567'
                sx={{ maxWidth: 320, mx: "auto" }}
              >
                Por favor, escoge uno de los cursos del panel izquierdo para
                generar el cálculo financiero y desbloquear las opciones de
                exportación.
              </Typography>
            </Box>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default GestionReportes;
