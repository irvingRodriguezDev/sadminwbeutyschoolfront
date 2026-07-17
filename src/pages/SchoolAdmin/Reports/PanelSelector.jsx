import { Download, School } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import UtilityReportTemplate from "../../../components/templates/ExpenseReportTemplate";

const PanelSelector = ({
  selectedCourseId,
  handleCourseChange,
  loadingCourses,
  courses,
  selectedCourseReport,
  loadingReport,
  cursoData,
  gastos,
  metodosAgrupados,
  loading,
  selectedCourseName,
  logo,
  selectedTeacherName,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.05)",
        p: 1,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Avatar
            sx={{ bgcolor: "rgba(229, 56, 136, 0.08)", color: "#E53888" }}
          >
            <School />
          </Avatar>
          <Typography variant='h6' fontWeight={700} color='#2A2628'>
            Configurar Reporte
          </Typography>
        </Box>

        <Typography variant='body2' color='#6B6567' sx={{ mb: 2 }}>
          Selecciona un curso activo para calcular inscripciones, abonos,
          ingresos acumulados y gastos asociados.
        </Typography>

        {/* Selector de Cursos Estilizado */}
        <TextField
          select
          fullWidth
          label='Seleccionar Curso'
          value={selectedCourseId}
          onChange={handleCourseChange}
          disabled={loadingCourses}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
        >
          <MenuItem value=''>
            <em>-- Selecciona un curso --</em>
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.titulo} - {course.maestro} - {course.fecha_inicio}
            </MenuItem>
          ))}
        </TextField>

        {/* BOTÓN DE DESCARGA PDF */}
        {selectedCourseReport && !loadingReport && (
          <PDFDownloadLink
            document={
              <UtilityReportTemplate
                cursoData={{
                  nombre: selectedCourseName,
                  maestro: selectedTeacherName,
                  totalIngresos: selectedCourseReport.totalIngresos,
                  totalGastos: selectedCourseReport.totalGastos,
                  estudiantes: selectedCourseReport.estudiantes,
                }}
                gastos={selectedCourseReport.gastos}
                metodosAgrupados={selectedCourseReport.metodosAgrupados}
                logo={logo}
              />
            }
            fileName={`Utilidad_${selectedCourseName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            {({ blob, url, loading, error }) => (
              <Button
                fullWidth
                variant='contained'
                disabled={loading || selectedCourseReport.totalIngresos === 0}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    <Download />
                  )
                }
                sx={{
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #E53888 0%, #ff6fa5 100%)",
                  fontWeight: "bold",
                  py: 1.8,
                  boxShadow: "0 8px 20px rgba(229, 56, 136, 0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    background:
                      "linear-gradient(135deg, #cc2e75 0%, #e0568c 100%)",
                    boxShadow: "0 10px 24px rgba(229, 56, 136, 0.35)",
                  },
                }}
              >
                {loading
                  ? "Estructurando PDF..."
                  : "Exportar Reporte Financiero"}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </CardContent>
    </Card>
  );
};

export default PanelSelector;
