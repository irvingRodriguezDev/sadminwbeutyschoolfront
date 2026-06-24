import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { motion } from "framer-motion";
import { supabase } from "../../config/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { alerts } from "../../utils/alerts";
import { Turnstile } from "@marsidev/react-turnstile";
const Login = () => {
  const cloudflareKey = import.meta.env.VITE_CLOUDFLARE_KEY;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const turnstileRef = useRef(null);

  const handleLogin = async (e) => {
    // 1. Detener la recarga del navegador INMEDIATAMENTE
    e.preventDefault();

    // 2. Validar si el captcha ya dio luz verde
    if (!token) {
      alerts.error(
        "Por favor, espera a que se complete la verificación de seguridad.",
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: token,
      },
    });

    if (error) {
      alerts.error("¡Cuidado!", error.message);
      turnstileRef.current?.reset();
      setToken(null);
    } else if (data.user) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #fce4ec 0%, #f06292 100%)",
      }}
    >
      <Container maxWidth='xs'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant='h4'
              fontWeight='bold'
              color='primary'
              gutterBottom
            >
              Bienvenido
            </Typography>
            <Typography variant='body2' color='textSecondary' mb={3}>
              Ingresa al panel de administración escolar
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label='Email'
                margin='normal'
                variant='outlined'
                autoComplete='off'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Email color='primary' />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                label='Contraseña'
                margin='normal'
                variant='outlined'
                autoComplete='off'
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
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
              <Link
                style={{ textDecoration: "none" }}
                to={"/recuperar-password"}
              >
                <Typography variant='body2' color='primary'>
                  Olvidaste tu contraseña <b>Haz Click aquí</b>
                </Typography>
              </Link>
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
                    filter: "hue-rotate(100deg) saturate(1.5) brightness(0.5)",
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
                disabled={loading}
                sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 1 }}
              >
                {loading ? "Entrando..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
