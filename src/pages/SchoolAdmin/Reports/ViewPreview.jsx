import { PeopleAlt } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const ViewPreview = ({ selectedCourseReport }) => {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.01)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PeopleAlt sx={{ color: "#E53888" }} />
            <Typography variant='subtitle1' fontWeight={700} color='#2A2628'>
              Resumen de Alumnos Registrados (
              {selectedCourseReport.estudiantes?.length || 0})
            </Typography>
          </Box>
          <Typography variant='caption' color='#6B6567' fontWeight={600}>
            Muestra parcial de los abonos
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {selectedCourseReport.estudiantes?.slice(0, 3).map((alumno, index) => (
          <Box
            key={alumno.id}
            sx={{
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #FAFAFA",
            }}
          >
            <Box>
              <Typography variant='body2' fontWeight={700} color='#2A2628'>
                {alumno.estudiante}
              </Typography>
              <Typography variant='caption' color='#6B6567'>
                {alumno.email}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant='body2' fontWeight={800} color='#E53888'>
                {FormatCurrency(alumno.totalEstudiante)}
              </Typography>
              <Typography variant='caption' color='#6B6567'>
                Acumulado
              </Typography>
            </Box>
          </Box>
        ))}
        {selectedCourseReport.estudiantes?.length > 3 && (
          <Typography
            variant='caption'
            color='#6B6567'
            sx={{
              display: "block",
              mt: 1,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            ... y {selectedCourseReport.estudiantes.length - 3} estudiantes más
            en el reporte completo PDF.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewPreview;
