import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import {
  Business,
  Email,
  Send,
  Storefront,
  Domain,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { escuelasService } from "../../api/schools";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { alerts } from "../../utils/alerts";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const FormNuevaEscuela = ({ onExito }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isFranchise, setIsFranchise] = useState(false);
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

    const datos = { name, emailAdmin, isFranchise };
    alerts.loading(
      "Creando Centro de Capacitaciones...",
      "Configurando la base de datos y enviando la invitación...",
    );

    try {
      setLoading(true);
      await escuelasService.registrarEscuelaCompleta(datos);

      alerts.success(
        "¡Registro Exitoso!",
        `La escuela "${datos.name}" ha sido creada. Se envió la invitación a ${datos.emailAdmin}.`,
      );

      if (onExito) onExito();
      await refreshGlobal();

      setTimeout(() => {
        navigate("/escuelas");
      }, 2000);
    } catch (err) {
      alerts.error(
        "Error al registrar",
        err.message || "Ocurrió un error inesperado al procesar la solicitud.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.04)}`,
          background: theme.palette.background.paper,
        }}
      >
        {/* Encabezado Principal */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant='h4'
            fontWeight='800'
            color='text.primary'
            letterSpacing='-0.5px'
            gutterBottom
          >
            Nuevo Centro de Capacitación
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Registra una nueva academia en el ecosistema y delega el acceso
            administrativo inicial.
          </Typography>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3.5}>
            {/* SECCIÓN 1: Selección del Tipo de Escuela (Propia vs Franquicia) */}
            <Grid size={12}>
              <Typography
                variant='subtitle2'
                fontWeight='700'
                color='text.secondary'
                sx={{
                  mb: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                1. Tipo de Modelo de Negocio
              </Typography>
              <Grid container spacing={2}>
                {/* Opción Escuela Propia */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsFranchise(false)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      border: `2px solid ${
                        !isFranchise
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      backgroundColor: !isFranchise
                        ? alpha(theme.palette.primary.main, 0.04)
                        : "transparent",
                      transition: "all 0.2s ease-in-out",
                      position: "relative",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      {!isFranchise && (
                        <CheckCircle
                          color='primary'
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontSize: 20,
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Domain color={!isFranchise ? "primary" : "action"} />
                        <Typography variant='h6' fontWeight='700'>
                          Sede Propia
                        </Typography>
                      </Box>
                      <Typography variant='body2' color='text.secondary'>
                        Cobros procesados de forma directa en la cuenta central
                        de la plataforma.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Opción Franquicia */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    component={motion.div}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsFranchise(true)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      border: `2px solid ${
                        isFranchise
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      backgroundColor: isFranchise
                        ? alpha(theme.palette.primary.main, 0.04)
                        : "transparent",
                      transition: "all 0.2s ease-in-out",
                      position: "relative",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      {isFranchise && (
                        <CheckCircle
                          color='primary'
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontSize: 20,
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Storefront
                          color={isFranchise ? "primary" : "action"}
                        />
                        <Typography variant='h6' fontWeight='700'>
                          Franquicia
                        </Typography>
                      </Box>
                      <Typography variant='body2' color='text.secondary'>
                        Requiere vincular su propia cuenta de Stripe Connect
                        para recibir pagos.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* SECCIÓN 2: Información General */}
            <Grid size={12}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.action.hover, 0.03),
                  border: `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant='subtitle2'
                  fontWeight='700'
                  color='text.secondary'
                  sx={{
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  2. Datos Principales
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      required
                      name='nombre'
                      label='Nombre de la Escuela o Sede'
                      placeholder='Ej. Wapizima Campus Guadalajara'
                      autoComplete='off'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Business color='primary' />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      required
                      name='emailAdmin'
                      label='Email del Administrador'
                      type='email'
                      placeholder='admin@escuela.com'
                      autoComplete='off'
                      helperText='Enviaremos la invitación para activar la cuenta y crear la contraseña.'
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Email color='primary' />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Botón de Acción */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                disabled={loading}
                startIcon={<Send />}
                sx={{
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: "700",
                  borderRadius: 2.5,
                  textTransform: "none",
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                {loading
                  ? "Procesando Registro..."
                  : "Crear Centro y Enviar Invitación"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default FormNuevaEscuela;
