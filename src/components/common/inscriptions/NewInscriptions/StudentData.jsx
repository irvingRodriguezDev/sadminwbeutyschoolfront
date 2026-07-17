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
      {/* 🔍 BUSCADOR INTELIGENTE */}
      <Grid size={12}>
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {/* 🚀 El buscador de react-select */}
          <Grid size={{ xs: 12, sm: 8, md: 8, lg: 8 }}>
            <Box sx={{ flexGrow: 1 }}>
              <SelectStudents detectarCambiosStudent={detectarCambiosStudent} />
            </Box>
          </Grid>

          {/* ➕ Botón para abrir el modal de nueva alumna */}
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <Button
              variant='contained'
              onClick={() => setOpenStudentModal(true)}
              sx={{
                width: "100%",
                backgroundColor: "primary",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "20px",
                px: 1,
                "&:hover": { backgroundColor: "primaryDark" },
              }}
            >
              + Crear
            </Button>
          </Grid>
        </Grid>
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
