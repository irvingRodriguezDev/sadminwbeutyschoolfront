import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { alerts } from "../../utils/alerts";
import { Business, Email, Send } from "@mui/icons-material";
import { motion } from "framer-motion";
import { escuelasService } from "../../api/schools";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const FormNuevaEscuela = ({ onExito }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshGlobal } = useSuperAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("nombre")?.toString().trim();
    const emailAdmin = formData.get("emailAdmin")?.toString().trim();

    if (!name || !emailAdmin) {
      alerts.error("Error", "Ambos campos son obligatorios.");
      return;
    }

    const datos = { name, emailAdmin };
    console.log(datos, "los datos que se supone se envian");

    Swal.fire({
      title: "Creando Academia...",
      text: "Estamos configurando la escuela y enviando la invitación al administrador.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      setLoading(true);
      await escuelasService.registrarEscuelaCompleta(datos);

      alerts.success(
        "¡Registro Exitoso!",
        `La escuela "${datos.name}" ha sido creada. Se envió un correo a ${datos.emailAdmin}.`,
      );

      if (onExito) onExito();
      await refreshGlobal();

      setTimeout(() => {
        navigate("/escuelas");
      }, 2500);
    } catch (err) {
      alerts.error(
        "Error al registrar",
        err.message || "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
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
                slotProps={{
                  input: {
                    startAdornment: <Business color='primary' sx={{ mr: 1 }} />,
                  },
                }}
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
                slotProps={{
                  input: {
                    startAdornment: <Email color='primary' sx={{ mr: 1 }} />,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
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
