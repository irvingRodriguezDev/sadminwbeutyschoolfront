import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, LocationOn, AccountBalanceWallet } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const ListaEscuelas = () => {
  const { escuelas_activas, loading } = useSuperAdmin();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER DE CONTROL */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{ fontWeight: 900, color: "#1a1a1a", letterSpacing: "-1px" }}
          >
            Escuelas Registradas
          </Typography>
          <Typography variant='body2' color='text.secondary' fontWeight='500'>
            Administración de planteles globales de Wapizima Beauty School
          </Typography>
        </Box>

        <Link to='/registrar-escuela' style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            startIcon={<Add />}
            disableElevation
            sx={{
              bgcolor: "#d81b60",
              color: "#fff",
              px: 3,
              py: 1.2,
              borderRadius: "12px",
              fontWeight: "700",
              textTransform: "none",
              "&:hover": { bgcolor: "#1a1a1a" },
            }}
          >
            Nueva Escuela
          </Button>
        </Link>
      </Box>

      {/* REJILLA DE ESCUELAS */}
      <Grid container spacing={3}>
        {escuelas_activas.map((escuela, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={escuela.id}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid rgba(0, 0, 0, 0.07)",
                  bgcolor: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  transition: "all 0.25s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 12px 30px rgba(240, 98, 146, 0.05)",
                    borderColor: "rgba(240, 98, 146, 0.35)",
                  },
                }}
              >
                {/* LÍNEA DETALLE SUPERIOR DE MARCA */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bgcolor: "#f06292",
                  }}
                />

                {/* CUERPO CENTRAL DE INFORMACIÓN */}
                <Box sx={{ minHeight: "65px" }}>
                  <Typography
                    variant='body1'
                    sx={{
                      fontWeight: 800,
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                      letterSpacing: "-0.3px",
                      mb: 1,
                    }}
                  >
                    {escuela.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    <LocationOn
                      sx={{ fontSize: 16, mt: 0.3, color: "text.disabled" }}
                    />
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "0.85rem",
                      }}
                      noWrap
                    >
                      {escuela.address || "Ubicación no definida"}
                    </Typography>
                  </Box>
                </Box>

                {/* FOOTER INTERACTIVO: BALANCE Y STRIPE */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 2,
                    borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                    mt: "auto",
                  }}
                >
                  <Chip
                    label={
                      escuela.stripe_account_id ? "CONECTADO" : "PENDIENTE"
                    }
                    size='small'
                    sx={{
                      bgcolor: escuela.stripe_account_id
                        ? "rgba(46, 125, 50, 0.08)"
                        : "rgba(237, 108, 2, 0.08)",
                      color: escuela.stripe_account_id ? "#2e7d32" : "#ed6c02",
                      fontWeight: "800",
                      fontSize: "0.68rem",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: escuela.stripe_account_id
                        ? "rgba(46, 125, 50, 0.15)"
                        : "rgba(237, 108, 2, 0.15)",
                    }}
                  />

                  <IconButton
                    size='small'
                    sx={{
                      color: "#d81b60",
                      bgcolor: "rgba(240, 98, 146, 0.06)",
                      "&:hover": { bgcolor: "rgba(240, 98, 146, 0.15)" },
                    }}
                  >
                    <AccountBalanceWallet sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Paper>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaEscuelas;
