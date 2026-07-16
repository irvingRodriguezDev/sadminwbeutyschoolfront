import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import { alerts } from "../../utils/alerts";
import { Turnstile } from "@marsidev/react-turnstile";

const CompleteSetup = () => {
  const cloudflareKey = import.meta.env.VITE_CLOUDFLARE_KEY;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true); // Estado para validar sesión
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const turnstileRef = useRef(null);

  useEffect(() => {
    // Validar si el link nos dio una sesión automática
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("No se encontró sesión activa del enlace");
          alerts.error(
            "El enlace de configuración no es válido o ha expirado.",
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setVerifying(false);
      }
    };

    checkSession();
  }, []);

  // Helper centralizado para reiniciar el captcha limpiamente
  const resetCaptcha = () => {
    setToken(null);
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    if (!token) {
      alerts.error(
        "Por favor, espera a que se complete la verificación de seguridad.",
      );
      resetCaptcha();
      return;
    }

    setLoading(true);

    // Intentar actualizar la contraseña
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alerts.error("¡Ups!", error.message);
      resetCaptcha(); // Re-inicializar captcha inmediatamente tras el fallo
      setLoading(false);
    } else {
      setSuccess(true);
      alerts.success("¡Correcto!", "¡Contraseña establecida con éxito!");

      // Esperar un momento para la animación de éxito antes de desloguear y redirigir
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login");
      }, 3000);
    }
  };

  // Solo mostramos la pantalla de carga inicial al verificar el token del enlace de correo
  if (verifying) {
    return <LoadingScreen message='Verificando enlace de invitación...' />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #fce4ec 0%, #f06292 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth='xs' disableGutters>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5 },
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "28px", // Bordes más suaves que combinan con tu app
              boxShadow: "0 24px 50px rgba(240, 98, 146, 0.15)",
            }}
          >
            {/* Ícono dinámico */}
            <Box sx={{ mb: 3 }}>
              {success ? (
                <CheckCircleOutlined sx={{ fontSize: 64, color: "#4caf50" }} />
              ) : (
                <LockReset sx={{ fontSize: 64, color: "#F06292" }} />
              )}
            </Box>

            {!success ? (
              <>
                <Typography
                  variant='h4'
                  fontWeight={800}
                  color='primary'
                  gutterBottom
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    color: "#D81B60",
                  }}
                >
                  Configura tu Acceso
                </Typography>

                <Typography
                  variant='body2'
                  sx={{
                    color: "#880E4F",
                    mb: 4,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  Establece una contraseña segura para comenzar a gestionar tu
                  institución.
                </Typography>

                <form onSubmit={handleFinish}>
                  <TextField
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    label='Nueva Contraseña'
                    variant='outlined'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                      },
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge='end'
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ color: "#F06292" }} />
                              ) : (
                                <Visibility sx={{ color: "#F06292" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* 🛡️ CONTENEDOR TURNSTILE REFORZADO */}
                  <Box
                    sx={{
                      my: 3.5,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      minHeight: "72px", // Evita saltos de layout
                      "& .cf-turnstile": {
                        borderRadius: "16px !important",
                        overflow: "hidden",
                        boxShadow: "0px 8px 24px rgba(240, 98, 146, 0.12)",
                        border: "1px solid rgba(240, 98, 146, 0.15)",
                      },
                      "& iframe": {
                        opacity: 0.95,
                        transition: "opacity 0.3s ease",
                      },
                    }}
                  >
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={cloudflareKey}
                      onSuccess={(token) => setToken(token)}
                      onExpire={() => resetCaptcha()} // Si expira por inactividad, se auto-recupera sola
                      onError={() => {
                        alerts.error(
                          "Error de verificación. Intentando reconectar...",
                        );
                        resetCaptcha();
                      }}
                      options={{
                        theme: "light",
                        size: "normal",
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={loading || password.length < 6}
                    sx={{
                      mt: 1,
                      py: 1.6,
                      fontWeight: "bold",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, #E53888 0%, #ff6fa5 100%)",
                      color: "#white",
                      boxShadow: "0 8px 25px rgba(229, 56, 136, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #cc2e75 0%, #e0568c 100%)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Activar mi Cuenta"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <Fade in={success}>
                <Box sx={{ py: 2 }}>
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color='#2E7D32'
                    gutterBottom
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    ¡Todo listo!
                  </Typography>
                  <Typography
                    variant='body1'
                    color='textSecondary'
                    sx={{ fontWeight: 500 }}
                  >
                    Tu contraseña ha sido guardada con éxito. Te redirigiremos
                    al login en unos instantes...
                  </Typography>
                </Box>
              </Fade>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CompleteSetup;
