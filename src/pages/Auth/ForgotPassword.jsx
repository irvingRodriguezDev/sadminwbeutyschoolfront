import React, { useRef, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  IconButton,
  Fade,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Email, Send, MarkEmailRead } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { alerts } from "../../utils/alerts"; // Aseguramos la importación correcta de tus alertas

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const turnstileRef = useRef(null);
  const cloudflareKey = import.meta.env.VITE_CLOUDFLARE_KEY;

  // Helper centralizado para reiniciar el captcha de manera síncrona
  const resetCaptcha = () => {
    setToken(null);
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();

    if (!token) {
      alerts.error(
        "Por favor, espera a que se complete la verificación de seguridad.",
      );
      resetCaptcha();
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Importante: Redirige a la misma página de 'complete-setup' que ya tenemos
      redirectTo: "https://wapizimabeautyschool.com/completed-setup",
    });

    if (error) {
      alerts.error("¡Ups!", error.message);
      setError(error.message);
      resetCaptcha(); // Reseteamos inmediatamente para un segundo intento
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #fce4ec 0%, #f06292 100%)",
        py: 4,
        px: 2, // Previene desbordamientos en móviles pequeños
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
              borderRadius: "28px", // Esquinas suavizadas de alta gama
              boxShadow: "0 24px 50px rgba(240, 98, 146, 0.15)",
            }}
          >
            {/* Botón de retroceso minimalista integrado */}
            <Box sx={{ mb: 1, textAlign: "left" }}>
              <IconButton
                onClick={() => navigate("/login")}
                sx={{
                  color: "#F06292",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                <ArrowBack sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {!sent ? (
              <>
                <Email sx={{ fontSize: 60, color: "#D81B60", mb: 2, mt: -2 }} />
                <Typography
                  variant='h4'
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    color: "#D81B60",
                  }}
                >
                  ¿Olvidaste tu contraseña?
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
                  No te preocupes. Ingresa tu correo electrónico registrado y te
                  enviaremos un enlace de recuperación.
                </Typography>

                {error && (
                  <Alert
                    severity='error'
                    sx={{
                      mb: 3,
                      borderRadius: "14px",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleResetRequest}>
                  <TextField
                    fullWidth
                    required
                    type='email'
                    label='Correo Electrónico'
                    variant='outlined'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
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
                      minHeight: "72px", // Asegura espacio estable para evitar saltos en carga
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
                      onExpire={() => resetCaptcha()} // Recuperación si el token expira por tiempo de espera
                      onError={() => {
                        alerts.error(
                          "Problema de verificación de seguridad. Reintentando...",
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
                    disabled={loading}
                    startIcon={!loading && <Send />}
                    sx={{
                      mt: 1,
                      py: 1.6,
                      fontWeight: "bold",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, #E53888 0%, #ff6fa5 100%)",
                      color: "#fff",
                      boxShadow: "0px 8px 25px rgba(229, 56, 136, 0.3)",
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
                      "Enviar Enlace"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <Fade in={sent}>
                <Box sx={{ py: 2 }}>
                  <MarkEmailRead
                    sx={{ fontSize: 72, color: "#10B981", mb: 2 }} // Verde de éxito refinado
                  />
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color='#D81B60'
                    gutterBottom
                    sx={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    ¡Enlace Enviado!
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    mb={4}
                    sx={{ fontWeight: 500, lineHeight: 1.5 }}
                  >
                    Hemos enviado las instrucciones a tu correo. Revisa tu
                    bandeja de entrada o la carpeta de correo no deseado (spam).
                  </Typography>
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#E53888",
                      borderColor: "#E53888",
                      borderRadius: "14px",
                      py: 1.4,
                      fontWeight: 700,
                      borderWidth: "1.5px",
                      "&:hover": {
                        borderColor: "#cc2e75",
                        backgroundColor: "rgba(229, 56, 136, 0.04)",
                        borderWidth: "1.5px",
                      },
                    }}
                  >
                    Volver al Inicio de Sesión
                  </Button>
                </Box>
              </Fade>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
