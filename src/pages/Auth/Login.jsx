import React, { useState } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email color='primary' />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label='Contraseña'
                margin='normal'
                variant='outlined'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Link
                style={{ textDecoration: "none" }}
                to={"/recuperar-password"}
              >
                <Typography variant='body2' color='primary'>
                  Olvidaste tu contraseña <b>Haz Click aquí</b>
                </Typography>
              </Link>
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
