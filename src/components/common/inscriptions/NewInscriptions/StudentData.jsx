import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddNewStudentModal from "./AddNewStudentModal";
import Select from "react-select";
import SelectStudents from "../../../selects/SelectStudents";

const StudentData = ({ setStudentId, setFormData, schoolId }) => {
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const detectarCambiosStudent = (value) => {
    setStudentId(value.value || null);
  };
  return (
    <>
      <Grid size={12}>
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
        >
          2. DATOS DEL ESTUDIANTE
        </Typography>
      </Grid>

      {/* 🔍 BUSCADOR INTELIGENTE */}
      <Grid size={12}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* 🚀 El buscador de react-select */}
          <Box sx={{ flexGrow: 1 }}>
            <SelectStudents detectarCambiosStudent={detectarCambiosStudent} />
          </Box>

          {/* ➕ Botón para abrir el modal de nueva alumna */}
          <Button
            variant='contained'
            onClick={() => setOpenStudentModal(true)}
            sx={{
              backgroundColor: "primary",
              color: "#fff",
              px: 1,
              "&:hover": { backgroundColor: "primaryDark" },
            }}
          >
            + Nueva
          </Button>
        </Box>
        <AddNewStudentModal
          open={openStudentModal}
          setOpen={setOpenStudentModal}
          onClose={() => setOpenStudentModal(false)}
          schoolId={schoolId}
          onStudentCreated={(newStudent) => {
            // 🎯 Capturamos la respuesta del modal y actualizamos el estado exacto del formulario principal
            setFormData({
              id: newStudent.id,
              name: newStudent.name,
              phone: newStudent.phone,
              email: newStudent.email || "",
            });
          }}
        />
      </Grid>
    </>
  );
};

export default StudentData;
