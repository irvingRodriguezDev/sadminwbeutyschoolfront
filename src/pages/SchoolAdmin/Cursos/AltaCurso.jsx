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

const steps = [
  "Información Básica",
  "Detalles y Materiales",
  "Horarios",
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
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label='Tipo de Evento'
                value={formData.tipo_curso}
                onChange={(e) =>
                  setFormData({ ...formData, tipo_curso: e.target.value })
                }
              >
                <MenuItem value='Curso'>Curso (Varios días)</MenuItem>
                <MenuItem value='Taller'>Taller (Un solo día)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label='Título'
                required
                autoComplete='off'
                value={formData.titulo}
                onChange={(e) => handleTituloChange(e.target.value)}
                helperText={`URL: /cursos/${formData.slug}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label='Maestro(a)'
                autoComplete='off'
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
                autoComplete='off'
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>$</InputAdornment>
                    ),
                  },
                }}
                value={formData.costo}
                onChange={(e) =>
                  setFormData({ ...formData, costo: e.target.value })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label='Salón'
                autoComplete='off'
                value={formData.salon_id}
                onChange={(e) =>
                  setFormData({ ...formData, salon_id: e.target.value })
                }
              >
                {salones.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombre} - {`Hasta ${s.capacidad} Alumnos`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant='subtitle2' gutterBottom color='#f06292'>
              Descripción del Curso
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TiptapEditor
                value={formData.descripcion}
                onChange={(content) =>
                  setFormData({ ...formData, descripcion: content })
                }
                placeholder='Ingresa la descripción del curso, en este espacio'
                style={{ height: "150px", marginBottom: "45px" }}
              />
            </Box>
            <Typography variant='subtitle2' gutterBottom color='#f06292'>
              Lista de Materiales
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TiptapEditor
                value={formData.lista_materiales}
                placeholder='Captura la lista de materiales en esta sección'
                onChange={(content) =>
                  setFormData({ ...formData, lista_materiales: content })
                }
                style={{ height: "150px", marginBottom: "45px" }}
              />
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <TextField
                fullWidth
                label='Fecha Inicio'
                type='date'
                autoComplete='off'
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
              />
            </Grid>
            {formData.tipo_curso === "Curso" && (
              <Grid size={{ xs: 12, md: 6, sm: 6, lg: 6 }}>
                <TextField
                  fullWidth
                  label='Fecha Fin'
                  type='date'
                  autoComplete='off'
                  InputLabelProps={{ shrink: true }}
                  value={formData.fecha_fin}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_fin: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <TextField
                fullWidth
                label='Hora Inicio'
                type='time'
                autoComplete='off'
                InputLabelProps={{ shrink: true }}
                value={formData.hora_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, hora_inicio: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <TextField
                fullWidth
                label='Hora Fin'
                type='time'
                autoComplete='off'
                InputLabelProps={{ shrink: true }}
                value={formData.hora_fin}
                onChange={(e) =>
                  setFormData({ ...formData, hora_fin: e.target.value })
                }
              />
            </Grid>
          </Grid>
        )}
        {activeStep === 3 && (
          <Grid container spacing={3}>
            {/* Flyer: Se queda como archivo */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant='subtitle2'
                mb={1}
                color='#f06292'
                fontWeight='bold'
              >
                Flyer del Curso (Imagen PNG/JPG)
              </Typography>
              <Button
                variant='outlined'
                component='label'
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  height: "120px",
                  borderStyle: "dashed",
                  borderColor: flyerFile ? "#f06292" : "rgba(0,0,0,0.23)",
                  color: flyerFile ? "#f06292" : "inherit",
                }}
              >
                {flyerFile ? `✓ ${flyerFile.name}` : "Seleccionar Imagen"}
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={(e) => setFlyerFile(e.target.files[0])}
                />
              </Button>
              <Typography
                variant='caption'
                display='block'
                sx={{ mt: 1, fontStyle: "italic" }}
              >
                * Recomendado: 1080x1350px para mejor visualización.
              </Typography>
            </Grid>

            {/* Video: Ahora es solo un Link de Redes Sociales */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant='subtitle2'
                mb={1}
                color='#f06292'
                fontWeight='bold'
              >
                Video de Presentación (Link)
              </Typography>
              <TextField
                fullWidth
                placeholder='Ej: https://www.tiktok.com/@tu_cuenta/video/...'
                label='URL de TikTok, Instagram o YouTube'
                value={formData.video_presentacion_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    video_presentacion_url: e.target.value,
                  })
                }
                helperText='Copia y pega el link del video promocional.'
              />
              <Box sx={{ mt: 2, p: 2, bgcolor: "#fff5f8", borderRadius: 2 }}>
                <Typography variant='caption' color='textSecondary'>
                  💡 **Tip Pro:** Usar links de TikTok ayuda a que tu contenido
                  sea viral y no consume espacio de tu servidor.
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
