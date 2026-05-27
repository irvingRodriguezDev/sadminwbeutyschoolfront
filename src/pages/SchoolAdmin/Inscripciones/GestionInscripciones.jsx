import React, { useEffect, useState } from "react";
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useAuth } from "../../../context/AuthContext";
import { useInscriptions } from "../../../context/InscriptionsContext";
import InscriptionsList from "./InscriptionsList";
import BuscadorGlobal from "../../../components/BuscadorGlobal";
import PaginadorGlobal from "../../../components/PaginadorGlobal";
const GestionInscripciones = () => {
  const { profile } = useAuth();

  // 📥 Extraemos la paginación global calculada por el InscriptionsProvider
  const {
    enrollments,
    fetchEnrollments,
    loading,
    paginationData,
    isFiltering,
  } = useInscriptions();

  // 📑 Estados locales para la reactividad de la vista
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounceSearchText] = useDebounce(search, 500);

  // 🔄 CONTROL DE RED INTELIGENTE UNIFICADO
  useEffect(() => {
    if (profile?.school_id) {
      // ✅ Pasamos los parámetros unificados bajo tu nueva estrategia
      fetchEnrollments(profile.school_id, {
        page,
        limit: 10,
        search: debounceSearchText,
      });
    }
    // Dispara la consulta solo cuando cambia de página o el usuario deja de escribir en la barra
  }, [profile?.school_id, page, debounceSearchText, fetchEnrollments]);

  // Si el administrador escribe un nuevo filtro, lo regresamos automáticamente a la página 1
  useEffect(() => {
    setPage(1);
  }, [debounceSearchText]);

  return (
    <Box sx={{ p: 3 }}>
      {/* 🌸 ENCABEZADO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant='h4' fontWeight='900'>
          Mis Inscripciones
        </Typography>
        <Link
          to={`/crear-inscripcion/${profile?.school_id}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            variant='contained'
            sx={{
              background: "linear-gradient(90deg, #E2208C 0%, #F06292 100%)",
              borderRadius: "12px",
              fontWeight: 700,
              px: 3,
              py: 1.2,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(240, 98, 146, 0.3)",
            }}
          >
            + Nueva Inscripción
          </Button>
        </Link>
      </Box>

      {/* 🔍 COMPONENTE GLOBAL DE BÚSQUEDA (Filtra por Alumna o Teléfono) */}
      <BuscadorGlobal
        search={search}
        setSearch={setSearch}
        placeholder='Buscar por alumna o teléfono...'
      />
      <Box sx={{ height: 4, mb: 2 }}>
        {isFiltering && (
          <LinearProgress
            sx={{
              bgcolor: "#FFF9FA",
              "& .MuiLinearProgress-bar": { bgcolor: "#F06292" },
            }}
          />
        )}
      </Box>
      {/* 📋 LISTADO DE REGISTROS */}
      <Grid container spacing={2}>
        <InscriptionsList
          enrollments={enrollments}
          loading={loading}
          isFiltering={isFiltering}
          schoolId={profile?.school_id}
        />
      </Grid>

      {/* 📑 COMPONENTE GLOBAL DE PAGINACIÓN */}
      <PaginadorGlobal
        totalPages={paginationData?.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default GestionInscripciones;
