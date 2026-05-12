import React, { useState } from "react";
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
  Alert,
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

const CompleteSetup = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Esto toma el token que viene en la URL automáticamente
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

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
