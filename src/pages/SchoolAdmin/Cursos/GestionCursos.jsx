import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useCursos } from "../../../context/CursoContext";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../config/supabaseClient"; // ✅ Agregado import
import { alerts } from "../../../utils/alerts";
import LoadingScreen from "../../../components/common/LoadingScreen";
import TarjetaCurso from "../../../components/common/TarjetaCurso";
import EditarCursoStepper from "./EditarCursoStepper";
import EmptyCursosAnimated from "./EmptyCursosAnimated";
import BuscadorGlobal from "../../../components/BuscadorGlobal";
import PaginadorGlobal from "../../../components/PaginadorGlobal";

const GestionCursos = () => {
  const { profile } = useAuth();
  // ✅ Cambiado refreshCursos por fetchCursos
  const { cursos, loadingCursos, paginationData, fetchCursos, isFiltering } =
    useCursos();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounceSearchText] = useDebounce(search, 500);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  // 🔄 CONTROL DE RED BLINDADO
  useEffect(() => {
    if (profile?.school_id) {
      // ✅ 1. Enviamos el parámetro correcto como 'search'
      // ✅ 2. Usamos 'debounceSearchText' para esperar a que el usuario termine de escribir
      fetchCursos(profile.school_id, {
        page,
        limit: 8,
        search: debounceSearchText,
      });
    }
    // ✅ 3. Quitamos 'search' de las dependencias para evitar peticiones masivas por cada tecla
  }, [page, debounceSearchText, profile?.school_id, fetchCursos]);

  // Restablecer a la página 1 si el usuario escribe una nueva búsqueda
  useEffect(() => {
    setPage(1);
  }, [debounceSearchText]);

  const eliminarCurso = async (id, titulo) => {
    const confirmacion = await alerts.confirm(
      `¿Eliminar "${titulo}"?`,
      "Esta acción borrará el curso y sus registros asociados de forma permanente.",
    );

    if (confirmacion.isConfirmed) {
      try {
        const { error } = await supabase.from("cursos").delete().eq("id", id);
        if (error) throw error;

        alerts.success("Eliminado", "El curso ha sido removido del catálogo.");
        // ✅ Refrescamos la página actual usando la función unificada
        fetchCursos(profile?.school_id, {
          page,
          limit: 8,
          search: debounceSearchText,
        });
      } catch (error) {
        alerts.error("No se pudo eliminar", error.message);
      }
    }
  };

  const handleEdit = (curso) => {
    setCursoSeleccionado(curso);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setCursoSeleccionado(null);
    setOpenEdit(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant='h4'>Mis Cursos y Talleres</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>
        <BuscadorGlobal
          search={search}
          setSearch={setSearch}
          placeholder='Buscar curso por título...'
          maxWidth='100%'
        />
      </Grid>
      <Grid
        size={{ xs: 12, md: 2 }}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Link to={"/crear-curso-nuevo"} style={{ textDecoration: "none" }}>
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
            + Nuevo Curso
          </Button>
        </Link>
      </Grid>
      <Grid size={12}>
        {isFiltering && (
          <LinearProgress
            sx={{
              bgcolor: "#FFF9FA",
              "& .MuiLinearProgress-bar": { bgcolor: "#F06292" },
            }}
          />
        )}
        {loadingCursos ? (
          <LoadingScreen message='Cargando Lista de Cursos...' />
        ) : (
          <>
            <Grid container spacing={3}>
              {cursos.map((curso) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}
                  key={curso.id}
                >
                  <TarjetaCurso
                    curso={curso}
                    onEdit={() => handleEdit(curso)}
                    onDelete={() => eliminarCurso(curso.id, curso.titulo)}
                  />
                </Grid>
              ))}
              {cursos.length === 0 && <EmptyCursosAnimated />}
            </Grid>

            {/* 📑 PAGINACIÓN ATRACTIVA DE MUI (Solo aparece si hay más de 1 página) */}
            {paginationData?.totalPages > 1 && (
              <PaginadorGlobal
                totalPages={paginationData?.totalPages}
                currentPage={page}
                onPageChange={setPage} // Setea directo el número devuelto por el hijo
              />
            )}

            {/* 📝 MODAL DE EDICIÓN */}
            {cursoSeleccionado && (
              <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                fullWidth
                maxWidth='lg'
              >
                <EditarCursoStepper
                  curso={cursoSeleccionado}
                  onClose={handleCloseEdit}
                  // ✅ Pasamos la función correcta inyectando los parámetros del estado actual
                  refreshCursos={() =>
                    fetchCursos(profile?.school_id, {
                      page,
                      limit: 8,
                      search: debounceSearchText,
                    })
                  }
                />
              </Dialog>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default GestionCursos;
