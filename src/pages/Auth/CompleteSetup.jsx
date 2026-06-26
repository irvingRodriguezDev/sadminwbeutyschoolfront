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
    // 1. Validar si el link nos dio una sesión automática
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("No se encontró sesión activa del enlace");
        // Opcional: podrías redirigir al login si el link es viejo
      }
      setVerifying(false);
      setLoading(false);
    };

    checkSession();
  }, []);

  const handleFinish = async (e) => {
    e.preventDefault();
    // 2. Validar si el captcha ya dio luz verde
    if (!token) {
      alerts.error(
        "Por favor, espera a que se complete la verificación de seguridad.",
      );
      return;
    }
    setLoading(true);

    // 2. Intentar actualizar la contraseña
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Si sigue saliendo authSessionMissing, es que el token expiró
      alerts.error("Error: " + error.message);
      turnstileRef.current?.reset();
      setToken(null);
      setLoading(false);
    } else {
      alerts.success("¡Correcto!", "¡Contraseña establecida con éxito!");
      // 3. Importante: cerrar sesión para limpiar el token del link
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  if (verifying)
    return <LoadingScreen message='Verificando enlace de invitación...' />;
  if (loading) return <LoadingScreen message='Guardando configuración...' />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #fce4ec 0%, #f06292 100%)",
        py: 4,
      }}
    >
      <Container maxWidth='xs'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 2,
              // boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <LockReset sx={{ fontSize: 60, color: "#F276A0" }} />
            </Box>

            {!success ? (
              <>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  color='white'
                  gutterBottom
                >
                  Configura tu Acceso
                </Typography>
                <Typography variant='body1' sx={{ color: "#F06292", mb: 4 }}>
                  Establece una contraseña segura para gestionar tu institución.
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
                    sx={{
                      borderRadius: 2,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "transparent",
                      },
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Box
                    sx={{
                      my: 3,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      // ✨ Filtramos el contenedor para suavizarlo e integrarlo a la paleta
                      "& div": {
                        borderRadius: "20px !important", // Forzamos esquinas ultra redondeadas premium
                        overflow: "hidden",
                        boxShadow: "0px 8px 24px rgba(240, 98, 146, 0.15)", // Resplandor rosa Wapizima
                        border: "1px solid rgba(240, 98, 146, 0.2)", // Borde rosa ultra fino
                        bgcolor: "#F16B99",
                      },
                      // Opcional: Si quieres suavizar un poco la intensidad de sus colores nativos
                      "& iframe": {
                        filter:
                          "hue-rotate(100deg) saturate(1.5) brightness(0.5)",
                      },
                    }}
                  >
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={cloudflareKey}
                      onSuccess={(token) => setToken(token)}
                      onExpire={() => setToken(null)}
                      onError={() => {
                        alerts.error(
                          "Hubo un problema con la verificación de seguridad. Reintentando...",
                        );
                        setToken(null);
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
                      mt: 4,
                      py: 1.8,
                      fontWeight: "bold",
                      borderRadius: 2,
                      backgroundColor: "white",
                      color: "#f06292",
                      "&:hover": { backgroundColor: "#fdf7f9" },
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    {loading ? "Activando..." : "Activar mi Cuenta"}
                  </Button>
                </form>
              </>
            ) : (
              <Fade in={success}>
                <Box>
                  <CheckCircleOutlined
                    sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
                  />
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color='white'
                    gutterBottom
                  >
                    ¡Todo listo!
                  </Typography>
                  <Typography variant='body1' color='white'>
                    Tu contraseña ha sido guardada. Te redirigiremos al login en
                    unos segundos...
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
