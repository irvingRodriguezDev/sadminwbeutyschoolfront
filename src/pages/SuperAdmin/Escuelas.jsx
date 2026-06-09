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
  TextField,
} from "@mui/material";
import { Add, LocationOn, AccountBalanceWallet } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSuperAdmin } from "../../context/SuperAdminContext";
import OutgoingMailIcon from "@mui/icons-material/OutgoingMail";
import CardEscuela from "./CardEscuela";
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
            sx={{
              fontWeight: 900,
              color: "#1a1a1a",
              letterSpacing: "-1px",
              ml: -12,
            }}
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
      <Grid size={12}>
        <TextField
          fullWidth
          type='search'
          placeholder='Buscar escuela por nombre...'
          variant='outlined'
          autoComplete='off'
          sx={{ mb: 4 }}
        />
      </Grid>
      {/* REJILLA DE ESCUELAS */}
      <Grid container spacing={3}>
        {escuelas_activas.map((escuela, index) => (
          <CardEscuela key={index} escuela={escuela} />
        ))}
      </Grid>
    </Box>
  );
};

export default ListaEscuelas;
