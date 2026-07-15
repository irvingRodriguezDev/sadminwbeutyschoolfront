import { Grid, InputAdornment, MenuItem, TextField } from "@mui/material";
import React from "react";

const StepperCero = ({
  formData,
  handleTituloChange,
  setFormData,
  salones,
}) => {
  return (
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
          onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
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
  );
};

export default StepperCero;
