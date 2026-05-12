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
import { School, Business, Email, MyLocation, Send } from "@mui/icons-material";
import { motion } from "framer-motion";
import { escuelasService } from "../../api/schools";
import { useNavigate } from "react-router-dom";
const FormNuevaEscuela = ({ onExito }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const datos = {
      name: formData.get("nombre"),
      address: formData.get("direccion"),
      lat: parseFloat(formData.get("lat")),
      lng: parseFloat(formData.get("lng")),
      emailAdmin: formData.get("emailAdmin"),
    };
    const emailAdmin = formData.get("emailAdmin");

    try {
      await escuelasService.registrarEscuelaCompleta(datos, emailAdmin);
      if (onExito) onExito();

      // Redirigir a la tabla de escuelas después de 2 segundos
      setTimeout(() => {
        navigate("/escuelas");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant='h5' fontWeight='bold' color='primary' gutterBottom>
          Registrar Nueva Institución
        </Typography>
        <Typography variant='body2' color='textSecondary' mb={3}>
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
                type='text'
                inputProps={{ step: "any" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                name='lng'
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
                sx={{ py: 1.5, fontWeight: "bold" }}
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
