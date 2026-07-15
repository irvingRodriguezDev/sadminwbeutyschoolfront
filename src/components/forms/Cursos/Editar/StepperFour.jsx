import { Button, Grid, TextField, Typography, Box } from "@mui/material";
import React from "react";
// 🌟 IMPORTACIÓN CORREGIDA: Traemos el icono que faltaba
import CloudUpload from "@mui/icons-material/CloudUpload";

const StepperFour = ({ flyerFile, setFlyerFile, formData, setFormData }) => {
  return (
    <Grid container spacing={3}>
      {/* 🖼️ SECCIÓN MULTIMEDIA: FLYER / PORTADA */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant='subtitle2'
          mb={1}
          color='#f06292'
          fontWeight='bold'
        >
          Flyer del Curso / Taller
        </Typography>

        <Button
          variant='outlined'
          component='label'
          fullWidth
          startIcon={<CloudUpload />}
          sx={{
            height: "100px",
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: flyerFile ? "#f06292" : "rgba(240, 98, 146, 0.25)",
            bgcolor: flyerFile ? "#fdf2f5" : "transparent",
            color: flyerFile ? "#d81b60" : "text.secondary",
            textTransform: "none",
            "&:hover": {
              borderColor: "#d81b60",
              bgcolor: "#fdf2f5",
            },
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='body2' fontWeight='600'>
              {flyerFile
                ? `✓ ${flyerFile.name}`
                : "Subir nueva imagen promocional"}
            </Typography>
            <Typography variant='caption' color='text.disabled' display='block'>
              {flyerFile
                ? "Haga clic para cambiar el archivo"
                : "Formatos aceptados: JPG, PNG, WEBP"}
            </Typography>
          </Box>
          <input
            type='file'
            hidden
            accept='image/*'
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFlyerFile(e.target.files[0]);
              }
            }}
          />
        </Button>
      </Grid>

      {/* 📹 SECCIÓN MULTIMEDIA: VIDEO */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant='subtitle2'
          mb={1}
          color='#f06292'
          fontWeight='bold'
        >
          Video de Presentación (Opcional)
        </Typography>
        <TextField
          fullWidth
          label='URL de Video (TikTok, YouTube o Reels)'
          // 🛡️ Previene warnings controlando nulos si no hay URL previa
          value={formData.video_presentacion_url || ""}
          placeholder='https://...'
          onChange={(e) =>
            setFormData({
              ...formData,
              video_presentacion_url: e.target.value,
            })
          }
        />
        <Typography
          variant='caption'
          color='text.disabled'
          sx={{ mt: 0.5, display: "block" }}
        >
          Inserta el enlace completo del video introductorio para las alumnas.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default StepperFour;
