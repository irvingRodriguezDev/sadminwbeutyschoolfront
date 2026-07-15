import { Grid, MenuItem, TextField } from "@mui/material";
import React from "react";

const StepperOne = ({ formData, setFormData, salones }) => {
  // 🌟 FUNCIÓN CORREGIDA: Ahora está declarada dentro del componente
  // para que gestione el cambio de título y auto-genere el slug al vuelo.
  const handleLocalTituloChange = (val) => {
    const newSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Reemplaza espacios por guiones
      .replace(/[^\w-]+/g, ""); // Remueve caracteres especiales inseguros para URLs

    setFormData({ ...formData, titulo: val, slug: newSlug });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label='Tipo'
          value={formData.tipo_curso || ""}
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
          value={formData.titulo || ""}
          // 🚀 Cambiado para usar la función local que genera el slug
          onChange={(e) => handleLocalTituloChange(e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label='Maestro'
          value={formData.maestro || ""}
          onChange={(e) =>
            setFormData({ ...formData, maestro: e.target.value })
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          select
          fullWidth
          label='Salón'
          autoComplete='off'
          // 🛡️ Extra: Respaldo por si Supabase inyectó el objeto completo en la consulta original
          value={formData.salon_id || formData.salon?.id || ""}
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

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label='Costo'
          type='number'
          value={formData.costo || ""}
          onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
        />
      </Grid>
    </Grid>
  );
};

export default StepperOne;
