import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const StepperTwo = ({ formData, setFormData }) => {
  // Aseguramos que plan_pagos siempre sea un arreglo para evitar fallos de renderizado
  const planPagos = Array.isArray(formData.plan_pagos)
    ? formData.plan_pagos
    : [];

  // Agregar un nuevo hito/abono al plan de pagos
  const handleAddPago = () => {
    const nuevoPago = {
      concepto: `Semana ${planPagos.length + 1}`,
      monto: 0,
      observacion: "",
    };
    setFormData({
      ...formData,
      plan_pagos: [...planPagos, nuevoPago],
    });
  };

  // Actualizar un hito específico del plan
  const handleUpdatePago = (index, field, value) => {
    const nuevosPagos = [...planPagos];
    nuevosPagos[index] = {
      ...nuevosPagos[index],
      [field]: field === "monto" ? parseFloat(value) || 0 : value,
    };
    setFormData({
      ...formData,
      plan_pagos: nuevosPagos,
    });
  };

  // Eliminar un hito del plan
  const handleRemovePago = (index) => {
    const nuevosPagos = planPagos.filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      plan_pagos: nuevosPagos,
    });
  };

  // Calcular la suma de todos los abonos en tiempo real
  const totalPlan = planPagos.reduce((acc, curr) => acc + (curr.monto || 0), 0);

  return (
    <Grid container spacing={3}>
      {/* --- SECCIÓN 1: HORARIOS Y FECHAS --- */}
      <Grid
        size={{ xs: 12, sm: 6, md: formData.tipo_curso === "Curso" ? 3 : 4 }}
      >
        <TextField
          fullWidth
          label='Fecha Inicio'
          type='date'
          autoComplete='off'
          InputLabelProps={{ shrink: true }}
          value={formData.fecha_inicio || ""}
          onChange={(e) =>
            setFormData({ ...formData, fecha_inicio: e.target.value })
          }
        />
      </Grid>

      {formData.tipo_curso === "Curso" && (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label='Fecha Fin'
            type='date'
            autoComplete='off'
            InputLabelProps={{ shrink: true }}
            value={formData.fecha_fin || ""}
            onChange={(e) =>
              setFormData({ ...formData, fecha_fin: e.target.value })
            }
          />
        </Grid>
      )}

      <Grid
        size={{ xs: 12, sm: 6, md: formData.tipo_curso === "Curso" ? 3 : 4 }}
      >
        <TextField
          fullWidth
          label='Hora Inicio'
          type='time'
          autoComplete='off'
          InputLabelProps={{ shrink: true }}
          value={formData.hora_inicio || ""}
          onChange={(e) =>
            setFormData({ ...formData, hora_inicio: e.target.value })
          }
        />
      </Grid>

      <Grid
        size={{ xs: 12, sm: 6, md: formData.tipo_curso === "Curso" ? 3 : 4 }}
      >
        <TextField
          fullWidth
          label='Hora Fin'
          type='time'
          autoComplete='off'
          InputLabelProps={{ shrink: true }}
          value={formData.hora_fin || ""}
          onChange={(e) =>
            setFormData({ ...formData, hora_fin: e.target.value })
          }
        />
      </Grid>

      {/* --- SECCIÓN 2: PLAN DE PAGOS DINÁMICO (JSONB) --- */}
      <Grid size={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            mt: 2,
          }}
        >
          <Box>
            <Typography variant='subtitle1' color='#f06292' fontWeight='bold'>
              Estructura del Plan de Pagos
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Define cómo la alumna irá liquidando el curso (ej. Inscripción,
              Semana 1, etc.)
            </Typography>
          </Box>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={handleAddPago}
            sx={{
              borderColor: "#f06292",
              color: "#f06292",
              "&:hover": { borderColor: "#d81b60", bgcolor: "#fdf2f5" },
            }}
          >
            Agregar Hito
          </Button>
        </Box>

        {planPagos.length === 0 ? (
          <Paper
            variant='outlined'
            sx={{
              p: 4,
              textAlign: "center",
              borderStyle: "dashed",
              borderColor: "rgba(0, 0, 0, 0.12)",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              No hay un plan de pagos definido para este curso. Haz clic en
              "Agregar Hito" para empezar.
            </Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            variant='outlined'
            sx={{ borderRadius: "8px" }}
          >
            <Table size='small'>
              <TableHead sx={{ bgcolor: "#fdf2f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#d81b60" }}>
                    Concepto / Abono
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#d81b60" }}>
                    Monto ($)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#d81b60" }}>
                    Observación (Opcional)
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ fontWeight: "bold", color: "#d81b60", width: 80 }}
                  >
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planPagos.map((pago, index) => (
                  <TableRow key={index}>
                    {/* Concepto */}
                    <TableCell>
                      <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        value={pago.concepto || ""}
                        onChange={(e) =>
                          handleUpdatePago(index, "concepto", e.target.value)
                        }
                        placeholder='Ej. Inscripción o Semana 1'
                      />
                    </TableCell>
                    {/* Monto */}
                    <TableCell>
                      <TextField
                        fullWidth
                        size='small'
                        type='number'
                        variant='standard'
                        value={pago.monto || ""}
                        onChange={(e) =>
                          handleUpdatePago(index, "monto", e.target.value)
                        }
                        placeholder='0.00'
                      />
                    </TableCell>
                    {/* Observación */}
                    <TableCell>
                      <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        value={pago.observacion || ""}
                        onChange={(e) =>
                          handleUpdatePago(index, "observacion", e.target.value)
                        }
                        placeholder='Ej. Se paga antes de iniciar la clase'
                      />
                    </TableCell>
                    {/* Botón Eliminar */}
                    <TableCell align='center'>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleRemovePago(index)}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fila de Resumen */}
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Suma Total Calculada:
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "#d81b60" }}
                    colSpan={3}
                  >
                    $
                    {totalPlan.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    MXN
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default StepperTwo;
