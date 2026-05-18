import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, LocationOn, AccountBalanceWallet } from "@mui/icons-material";
import { motion } from "framer-motion";
import { escuelasService } from "../../api/schools";
import { Link } from "react-router-dom";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const ListaEscuelas = () => {
  const { escuelas_activas } = useSuperAdmin();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant='h4' fontWeight='bold' color='primary'>
          Escuelas Registradas
        </Typography>
        <Link to={"/registrar-escuela"} style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
            // Aquí abriremos el formulario que haremos a continuación
          >
            Nueva Escuela
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        {escuelas_activas.map((escuela, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={escuela.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Typography variant='h6' fontWeight='bold'>
                    {escuela.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      color: "text.secondary",
                    }}
                  >
                    <LocationOn fontSize='small' sx={{ mr: 0.5 }} />
                    <Typography variant='body2'>
                      {escuela.address || "Ubicación no definida"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Chip
                      label={
                        escuela.stripe_account_id
                          ? "Stripe Conectado"
                          : "Stripe Pendiente"
                      }
                      color={escuela.stripe_account_id ? "success" : "warning"}
                      size='small'
                      variant='outlined'
                    />
                    <IconButton color='primary'>
                      <AccountBalanceWallet />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaEscuelas;
