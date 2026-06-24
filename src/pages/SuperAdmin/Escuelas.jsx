import React, { useEffect, useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import { useDebounce } from "use-debounce";
import { Add, LocationOn, AccountBalanceWallet } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSuperAdmin } from "../../context/SuperAdminContext";
import OutgoingMailIcon from "@mui/icons-material/OutgoingMail";
import CardEscuela from "./CardEscuela";
import BuscadorGlobal from "../../components/BuscadorGlobal";
const ListaEscuelas = () => {
  const { escuelas_activas, loading } = useSuperAdmin();
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 500);
  const [escuelas, setEscuelas] = useState([]);

  useEffect(() => {
    if (!debounceSearch || debounceSearch.trim() === "") {
      setEscuelas(escuelas_activas);
      return;
    }

    const query = debounceSearch.toLowerCase().trim();

    const escuelasFiltradas = escuelas_activas.filter((escuela) => {
      const nombreEscuela = escuela.name ? escuela.name.toLowerCase() : "";

      return nombreEscuela.includes(query);
    });

    setEscuelas(escuelasFiltradas);
  }, [debounceSearch]);
  return (
    <Grid container spacing={2}>
      {/* HEADER DE CONTROL */}
      <Grid size={12}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 900,
            color: "#1a1a1a",
            letterSpacing: "-1px",
          }}
        >
          Escuelas Registradas
        </Typography>
        <Typography variant='body2' color='text.secondary' fontWeight='500'>
          Administración de academias globales de Wapizima Beauty School
        </Typography>
      </Grid>
      <Grid
        size={{ xs: 12, md: 12 }}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Link to='/registrar-escuela' style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            startIcon={<Add />}
            fullWidth
            disableElevation
            sx={{
              bgcolor: "#e21d8c",
              color: "#fff",
              px: 3,
              py: 1.2,
              height: "55px",
              borderRadius: "12px",
              fontWeight: "700",
              textTransform: "none",
              "&:hover": { bgcolor: "#e21d8c" },
            }}
          >
            Nueva Escuela
          </Button>
        </Link>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <BuscadorGlobal
          search={search}
          setSearch={setSearch}
          placeholder='Buscar academia'
          maxWidth='100%'
        />
      </Grid>

      {/* REJILLA DE ESCUELAS */}
      {search !== null && escuelas.length > 0
        ? escuelas.map((escuela, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
              <CardEscuela key={index} escuela={escuela} />
            </Grid>
          ))
        : escuelas_activas.map((escuela, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
              <CardEscuela key={index} escuela={escuela} />
            </Grid>
          ))}
    </Grid>
  );
};

export default ListaEscuelas;
