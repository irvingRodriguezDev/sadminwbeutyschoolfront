import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useSchool } from "../../../context/SchoolContext";
import { supabase } from "../../../config/supabaseClient";
import { alerts } from "../../../utils/alerts";
import TiptapEditor from "./TipTapEditor";
import {
  ArrowBackIos,
  CloudUpload,
  SettingsBackupRestoreSharp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import generateSlug from "../../../utils/GenerateSlug";
import StepperCero from "../../../components/forms/Cursos/Alta/StepperCero";
import StepperOne from "../../../components/forms/Cursos/Alta/StepperOne";
import StepperTwo from "../../../components/forms/Cursos/Alta/StepperTwo";
import StepperThree from "../../../components/forms/Cursos/Alta/StepperThree";

const steps = [
  "Información Básica",
  "Detalles y Materiales",
  "Horarios y plan de pagos",
  "Multimedia",
];

const AltaCursoStepper = () => {
  const navigate = useNavigate();
  const { school, salones } = useSchool();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // Estados para archivos locales
  const [flyerFile, setFlyerFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    maestro: "",
    descripcion: "",
    lista_materiales: "",
    costo: "",
    salon_id: "",
    tipo_curso: "Curso",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    video_presentacion_url: "",
    flayer_url: "",
    temario: null,
    plan_pagos: null,
  });
  const handleTituloChange = (val) => {
    setFormData({
      ...formData,
      titulo: val,
      slug: generateSlug(val),
    });
  };
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
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
  const guardarCurso = async () => {
    setLoading(true);
    try {
      let finalFlyerUrl = formData.flayer_url;
      let finalVideoUrl = formData.video_presentacion_url;

      // Subir archivos si existen
      if (flyerFile) {
        finalFlyerUrl = await uploadFile(flyerFile, "school-assets", "flyers");
      }
      const { error } = await supabase.from("cursos").insert([
        {
          ...formData,
          school_id: school.id,
          costo: parseFloat(formData.costo),
          flayer_url: finalFlyerUrl,
          video_presentacion_url: finalVideoUrl,
          fecha_fin:
            formData.tipo_curso === "Taller"
              ? formData.fecha_inicio
              : formData.fecha_fin,
          status: "active",
          plan_pagos: formData.plan_pagos,
          temario: formData.temario,
        },
      ]);

      if (error) throw error;
      alerts.success(
        "¡Curso Publicado!",
        "El curso se ha registrado con éxito.",
      );
      navigate(-1);
    } catch (error) {
      alerts.error("Error al guardar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant='contained'
            color='primary'
            sx={{ borderRadius: 1 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIos /> Regresar
          </Button>
        </Grid>
      </Grid>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ "& .MuiStepLabel-label": { color: "#f06292" } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        variant='outlined'
        sx={{ p: 3, borderRadius: 1, border: "1px solid #fce4ec" }}
      >
        {activeStep === 0 && (
          <StepperCero
            formData={formData}
            setFormData={setFormData}
            salones={salones}
            handleTituloChange={handleTituloChange}
          />
        )}

        {activeStep === 1 && (
          <StepperOne formData={formData} setFormData={setFormData} />
        )}

        {activeStep === 2 && (
          <StepperTwo formData={formData} setFormData={setFormData} />
        )}
        {activeStep === 3 && (
          <StepperThree
            formData={formData}
            setFormData={setFormData}
            flyerFile={flyerFile}
            setFlyerFile={setFlyerFile}
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Atrás
          </Button>
          <Button
            variant='contained'
            onClick={
              activeStep === steps.length - 1 ? guardarCurso : handleNext
            }
            disabled={loading}
            sx={{
              bgcolor: "#f06292",
              borderRadius: 1,
              "&:hover": { bgcolor: "#d81b60" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : activeStep === steps.length - 1 ? (
              "Finalizar"
            ) : (
              "Siguiente"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AltaCursoStepper;
