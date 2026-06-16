import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FormatCurrency } from "../../../../utils/FormatCurrency";
import { Class as CourseIcon } from "@mui/icons-material";
import SelectCourses from "../../../selects/SelectCourses";
const SelectCourse = ({
  handleCourseChange,
  formData,
  loadingCourses,
  cursos,
  availability,
  setSelectedCourse,
  selectedCourse,
}) => {
  const detectarCambiosCursos = (value) => {
    handleCourseChange(value);
  };

  return (
    <Grid size={12}>
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
      >
        1. SELECCIÓN DE CURSO / MASTERCLASS
      </Typography>
      <SelectCourses detectarCambiosCursos={detectarCambiosCursos} />

      {/* Banner Informativo del Cupo del Salón asignado */}
      {selectedCourse && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(240, 98, 146, 0.2)",
          }}
        >
          <Stack
            direction='row'
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            spacing={2}
            useFlexGap
          >
            <Typography variant='body2' color='textSecondary'>
              📍 Salón:{" "}
              <strong>{selectedCourse.salon?.nombre || "Sin asignar"}</strong>
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              👥 Capacidad: <strong>{availability.capacity} lugares</strong>
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 700,
                color:
                  availability.slots_left <= 0 ? "error.main" : "success.main",
              }}
            >
              🎟️ Disponibles: {availability.slots_left} lugares
            </Typography>
          </Stack>
        </Box>
      )}
    </Grid>
  );
};

export default SelectCourse;
