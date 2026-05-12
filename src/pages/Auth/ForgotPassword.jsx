import React, { useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  IconButton,
  Alert,
  Fade,
} from "@mui/material";
import { ArrowBack, Email, Send, MarkEmailRead } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Importante: Redirige a la misma página de 'complete-setup' que ya tenemos
      redirectTo: "http://localhost:5173/complete-setup",
    });

    if (error) {
      setError(error.message);
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
      }}
    >
      <Container maxWidth='xs'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 2, textAlign: "left" }}>
              <IconButton
                onClick={() => navigate("/login")}
                sx={{ color: "#F2749F" }}
              >
                <ArrowBack />
              </IconButton>
            </Box>

            {!sent ? (
              <>
                <Email sx={{ fontSize: 50, color: "#F2749F", mb: 2, mt: -4 }} />
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  color='white'
                  gutterBottom
                >
                  ¿Olvidaste tu clave?
                </Typography>
                <Typography variant='body2' sx={{ color: "#F2749F", mb: 4 }}>
                  No te preocupes. Ingresa tu correo y te enviaremos un enlace
                  para restablecerla.
                </Typography>

                {error && (
                  <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
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
                    sx={{
                      borderRadius: 2,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "transparent",
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    startIcon={<Send />}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: 3,
                      backgroundColor: "primary",

                      "&:hover": { backgroundColor: "primary" },
                    }}
                  >
                    {loading ? "Enviando..." : "Enviar Enlace"}
                  </Button>
                </form>
              </>
            ) : (
              <Fade in={sent}>
                <Box sx={{ py: 2 }}>
                  <MarkEmailRead
                    sx={{ fontSize: 70, color: "#a5d6a7", mb: 2 }}
                  />
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color='white'
                    gutterBottom
                  >
                    ¡Correo Enviado!
                  </Typography>
                  <Typography variant='body1' color='white' mb={4}>
                    Revisa tu bandeja de entrada. Si no lo ves, checa en spam.
                  </Typography>
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      borderRadius: 3,
                    }}
                  >
                    Volver al Login
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
