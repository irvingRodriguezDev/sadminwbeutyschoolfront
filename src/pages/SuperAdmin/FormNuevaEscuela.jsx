import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  Divider,
  Alert,
} from "@mui/material";
import { alerts } from "../../utils/alerts";
import { School, Business, Email, MyLocation, Send } from "@mui/icons-material";
import { motion } from "framer-motion";
import { escuelasService } from "../../api/schools";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const FormNuevaEscuela = ({ onExito }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datos = {
      name: formData.get("nombre"),
      address: formData.get("direccion"),
      lat: parseFloat(formData.get("lat")),
      lng: parseFloat(formData.get("lng")),
      emailAdmin: formData.get("emailAdmin"),
    };

    // 1. Mostrar loading inmediato con SweetAlert2
    Swal.fire({
      title: "Creando Academia...",
      text: "Estamos configurando la escuela y enviando la invitación al administrador.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Esto pone el spinner premium de Swal
      },
    });

    try {
      // 2. Ejecutar la llamada al servicio
      await escuelasService.registrarEscuelaCompleta(datos, datos.emailAdmin);

      // 3. Cambiar el loading por éxito
      alerts.success(
        "¡Registro Exitoso!",
        `La escuela "${datos.name}" ha sido creada. Se envió un correo a ${datos.emailAdmin}.`,
      );

      if (onExito) onExito();

      // 4. Redirigir (El usuario verá la confirmación de éxito antes de irse)
      setTimeout(() => {
        navigate("/escuelas");
      }, 2500);
    } catch (err) {
      // 5. En caso de error, cerramos el loading y mostramos el error
      alerts.error("Error al registrar", err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant='h5' fontWeight='bold' color='primary' gutterBottom>
          Registrar Nuevo Centro de Capacitaciones
        </Typography>
        <Typography
          variant='body2'
          color='textSecondary'
          sx={{ marginBottom: 3 }}
        >
          Configura los datos base de la escuela y asigna un administrador.
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Sección Escuela */}
            <Grid size={12}>
              <TextField
                fullWidth
                required
                name='nombre'
                label='Nombre de la Escuela'
                autoComplete='off'
                InputProps={{
                  startAdornment: <Business color='primary' sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                name='direccion'
                label='Dirección Completa'
                autoComplete='off'
                placeholder='Ej. Av. Vallarta 123, Guadalajara'
                InputProps={{
                  startAdornment: <MyLocation color='primary' sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Coordenadas (Provisionales hasta meter Google Maps) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                name='lat'
                label='Latitud'
                autoComplete='off'
                type='text'
                inputProps={{ step: "any" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                name='lng'
                autoComplete='off'
                label='Longitud'
                type='text'
                inputProps={{ step: "any" }}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }}>Datos del Administrador</Divider>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                required
                name='emailAdmin'
                autoComplete='off'
                label='Email del Administrador'
                type='email'
                helperText='Se enviará una invitación para configurar su contraseña.'
                InputProps={{
                  startAdornment: <Email color='primary' sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid size={12} sx={{ mt: 2 }}>
              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                disabled={loading}
                startIcon={<Send />}
                sx={{ py: 1.5, fontWeight: "bold", borderRadius: 1 }}
              >
                {loading ? "Procesando..." : "Crear Escuela y Admin"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default FormNuevaEscuela;
