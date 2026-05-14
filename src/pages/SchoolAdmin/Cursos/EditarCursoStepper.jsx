import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../../config/supabaseClient";
import { useSchool } from "../../../context/SchoolContext"; // Importante para el school.id
import { alerts } from "../../../utils/alerts";
import TiptapEditor from "./TipTapEditor";
import { CloudUpload } from "@mui/icons-material";

const steps = ["Info Básica", "Detalles", "Horarios", "Multimedia"];

const EditarCursoStepper = ({ curso, onClose, refreshCursos }) => {
  const { school } = useSchool(); // Obtenemos la escuela del contexto
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...curso });
  const [flyerFile, setFlyerFile] = useState(null);

  // Función de subida corregida
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

  const handleTituloChange = (val) => {
    const newSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setFormData({ ...formData, titulo: val, slug: newSlug });
  };

  const actualizarCurso = async () => {
    setLoading(true);
    try {
      let finalFlyerUrl = formData.flayer_url;

      // 1. Si hay un nuevo archivo seleccionado, lo subimos
      if (flyerFile) {
        finalFlyerUrl = await uploadFile(flyerFile, "school-assets", "flyers");
      }

      // 2. Preparamos los datos (eliminamos campos que no van en el update si es necesario)
      const { salon, ...cleanData } = formData; // Extraemos 'salon' si viene del join del context

      const dataToUpdate = {
        ...cleanData,
        flayer_url: finalFlyerUrl,
        fecha_fin:
          formData.tipo_curso === "Taller"
            ? formData.fecha_inicio
            : formData.fecha_fin,
        costo: parseFloat(formData.costo),
      };

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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label='Tipo'
                value={formData.tipo_curso}
                onChange={(e) =>
                  setFormData({ ...formData, tipo_curso: e.target.value })
                }
              >
                <MenuItem value='Curso'>Curso</MenuItem>
                <MenuItem value='Taller'>Taller</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Título'
                value={formData.titulo}
                onChange={(e) => handleTituloChange(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label='Maestro'
                value={formData.maestro}
                onChange={(e) =>
                  setFormData({ ...formData, maestro: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label='Costo'
                type='number'
                value={formData.costo}
                onChange={(e) =>
                  setFormData({ ...formData, costo: e.target.value })
                }
              />
            </Grid>
          </Grid>
        )}

        {/* PASO 1: DETALLES (TipTap) */}
        {activeStep === 1 && (
          <Box>
            <Typography variant='subtitle2' gutterBottom color='#f06292'>
              Descripción
            </Typography>
            <TiptapEditor
              value={formData.descripcion}
              onChange={(c) => setFormData({ ...formData, descripcion: c })}
            />
            <Typography
              variant='subtitle2'
              gutterBottom
              color='#f06292'
              sx={{ mt: 3 }}
            >
              Lista de Materiales
            </Typography>
            <TiptapEditor
              value={formData.lista_materiales}
              onChange={(c) =>
                setFormData({ ...formData, lista_materiales: c })
              }
            />
          </Box>
        )}

        {/* PASO 2: HORARIOS */}
        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Fecha Inicio'
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
              />
            </Grid>
            {formData.tipo_curso === "Curso" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Fecha Fin'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  value={formData.fecha_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_fin: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Hora Inicio'
                type='time'
                InputLabelProps={{ shrink: true }}
                value={formData.hora_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, hora_inicio: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Hora Fin'
                type='time'
                InputLabelProps={{ shrink: true }}
                value={formData.hora_fin}
                onChange={(e) =>
                  setFormData({ ...formData, hora_fin: e.target.value })
                }
              />
            </Grid>
          </Grid>
        )}

        {/* PASO 3: MULTIMEDIA */}
        {activeStep === 3 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant='subtitle2'
                mb={1}
                color='#f06292'
                fontWeight='bold'
              >
                Flyer (Opcional nuevo)
              </Typography>
              <Button
                variant='outlined'
                component='label'
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  height: "100px",
                  borderStyle: "dashed",
                  borderColor: flyerFile ? "#f06292" : "rgba(0,0,0,0.23)",
                }}
              >
                {flyerFile ? `✓ ${flyerFile.name}` : "Cambiar Imagen"}
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={(e) => setFlyerFile(e.target.files[0])}
                />
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant='subtitle2'
                mb={1}
                color='#f06292'
                fontWeight='bold'
              >
                Link Video (TikTok/YT)
              </Typography>
              <TextField
                fullWidth
                label='URL Video'
                value={formData.video_presentacion_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    video_presentacion_url: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
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
