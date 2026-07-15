import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../../config/supabaseClient";
import { useSchool } from "../../../context/SchoolContext"; // Importante para el school.id
import { alerts } from "../../../utils/alerts";
import StepperOne from "../../../components/forms/Cursos/Editar/StepperOne";
import StepperTwo from "../../../components/forms/Cursos/Editar/StepperTwo";
import StepperThree from "../../../components/forms/Cursos/Editar/StepperThree";
import StepperFour from "../../../components/forms/Cursos/Editar/StepperFour";

const steps = [
  "Info Básica",
  "Detalles y Materiales",
  "Horarios y plan de pagos",
  "Multimedia",
];

const EditarCursoStepper = ({ curso, onClose, refreshCursos }) => {
  const { school, salones } = useSchool(); // Obtenemos la escuela del contexto
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...curso });
  const [flyerFile, setFlyerFile] = useState(null);

  // Sincroniza el formulario si el curso seleccionado cambia por props
  useEffect(() => {
    if (curso) {
      setFormData({ ...curso });
    }
  }, [curso]);

  // Función de subida a Storage de Supabase
  const uploadFile = async (file, bucket, folder) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${school.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Sanitizador: Filtra y limpia los campos que van directamente a la base de datos de cursos.
  // Evita enviar objetos relacionados (como 'salon' o 'students') que causan error de inserción en Supabase.
  const getCleanData = (data) => {
    return {
      titulo: data.titulo,
      slug: data.slug,
      descripcion: data.descripcion,
      tipo_curso: data.tipo_curso,
      maestro: data.maestro,
      salon_id: data.salon_id || data.salon?.id || null, // Asegura mandar la FK numérica o UUID, no el objeto completo
      fecha_inicio: data.fecha_inicio,
      fecha_fin:
        data.tipo_curso === "Taller" ? data.fecha_inicio : data.fecha_fin,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      costo: parseFloat(data.costo) || 0,
      temario: data.temario,
      plan_pagos: data.plan_pagos,
      lista_materiales: data.lista_materiales,
    };
  };

  const actualizarCurso = async () => {
    setLoading(true);
    try {
      let finalFlyerUrl = formData.flayer_url;

      // 1. Si hay un nuevo archivo seleccionado, lo subimos
      if (flyerFile) {
        finalFlyerUrl = await uploadFile(flyerFile, "school-assets", "flyers");
      }

      // 2. Preparamos los datos limpios de forma segura
      const dataToUpdate = {
        ...getCleanData(formData),
        flayer_url: finalFlyerUrl,
      };

      // 3. Ejecutamos el update en Supabase
      const { error } = await supabase
        .from("cursos")
        .update(dataToUpdate)
        .eq("id", curso.id);

      if (error) throw error;

      alerts.success(
        "¡Actualizado!",
        "Los cambios se guardaron correctamente.",
      );
      refreshCursos();
      onClose();
    } catch (error) {
      alerts.error("Error al actualizar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button color='error' variant='outlined' onClick={onClose}>
          Cerrar
        </Button>
      </Box>
      <Typography
        variant='h5'
        sx={{
          textAlign: "center",
          mb: 3,
          fontWeight: "bold",
          color: "#f06292",
        }}
      >
        Editar {formData.tipo_curso}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  color:
                    activeStep === steps.indexOf(label) ? "#f06292" : "inherit",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        variant='outlined'
        sx={{ p: 3, borderRadius: 2, border: "1px solid #fce4ec" }}
      >
        {/* PASO 0: BÁSICO */}
        {activeStep === 0 && (
          <StepperOne
            formData={formData}
            setFormData={setFormData}
            salones={salones}
          />
        )}

        {/* PASO 1: DETALLES (TipTap) */}
        {activeStep === 1 && (
          <StepperTwo formData={formData} setFormData={setFormData} />
        )}

        {/* PASO 2: HORARIOS */}
        {activeStep === 2 && (
          <StepperThree formData={formData} setFormData={setFormData} />
        )}

        {/* PASO 3: MULTIMEDIA */}
        {activeStep === 3 && (
          <StepperFour
            flyerFile={flyerFile}
            setFlyerFile={setFlyerFile}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Atrás
          </Button>
          <Button
            variant='contained'
            disabled={loading}
            onClick={
              activeStep === steps.length - 1
                ? actualizarCurso
                : () => setActiveStep(activeStep + 1)
            }
            sx={{
              bgcolor: "#f06292",
              ml: 1,
              "&:hover": { bgcolor: "#d81b60" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : activeStep === steps.length - 1 ? (
              "Guardar Cambios"
            ) : (
              "Siguiente"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditarCursoStepper;
