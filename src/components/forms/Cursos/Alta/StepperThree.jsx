import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

const StepperThree = ({ flyerFile, setFlyerFile, formData, setFormData }) => {
  return (
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
            💡 **Tip Pro:** Usar links de TikTok ayuda a que tu contenido sea
            viral y no consume espacio de tu servidor.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StepperThree;
