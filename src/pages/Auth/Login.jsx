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

  const resetCaptcha = () => {
    setToken(null);
    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!token) {
      alerts.error("Por favor, completa la verificación de seguridad.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: token,
        },
      });

      if (error) {
        alerts.error("¡Cuidado!", error.message);
        resetCaptcha(); // Reinicia el widget limpiamente para el próximo intento
      } else if (data.user) {
        navigate("/dashboard");
      }
    } catch (err) {
      alerts.error("Error", "Ocurrió un error inesperado al iniciar sesión.");
      resetCaptcha();
    } finally {
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
              borderRadius: 4,
            }}
          >
            <Typography
              variant='h4'
              fontWeight='bold'
              color='primary'
              gutterBottom
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
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

              <Box sx={{ textAlign: "right", mt: 1, mb: 2 }}>
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/recuperar-password"}
                >
                  <Typography
                    variant='body2'
                    color='primary'
                    sx={{ fontWeight: 600 }}
                  >
                    ¿Olvidaste tu contraseña? <b>Haz clic aquí</b>
                  </Typography>
                </Link>
              </Box>

              {/* 🛡️ CONTENEDOR TURNSTILE */}
              <Box
                sx={{
                  my: 3,
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  minHeight: "65px",
                }}
              >
                <Turnstile
                  ref={turnstileRef}
                  siteKey={cloudflareKey}
                  onSuccess={(token) => setToken(token)}
                  onExpire={() => resetCaptcha()}
                  onError={() => resetCaptcha()}
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
                disabled={loading || !token} // Previene clics antes de validar Turnstile
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #E53888 0%, #ff6fa5 100%)",
                  boxShadow: "0px 8px 20px rgba(229, 56, 136, 0.25)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #cc2e75 0%, #e0568c 100%)",
                  },
                  "&:disabled": {
                    background: "#ccc",
                  },
                }}
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
