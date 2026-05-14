import { Box, Button, Dialog, Grid, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { Link } from "react-router-dom";
import { useCursos } from "../../../context/CursoContext";
import TarjetaCurso from "../../../components/common/TarjetaCurso";
import EditarCursoStepper from "./EditarCursoStepper";
import { alerts } from "../../../utils/alerts";

const GestionCursos = () => {
  const { cursos, loadingCursos, refreshCursos } = useCursos();
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
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
        refreshCursos(); // Refresca el context
      } catch (error) {
        alerts.error("No se pudo eliminar", error.message);
      }
    }
  };
  // Esta es la función onEdit que pasarás a tus tarjetas
  const handleEdit = (curso) => {
    setCursoSeleccionado(curso);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setCursoSeleccionado(null);
    setOpenEdit(false);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant='h4' fontWeight='bold'>
          Mis cursos y talleres
        </Typography>
        <Link to={"/crear-curso-nuevo"} style={{ textDecoration: "none" }}>
          <Button
            variant='contained'
            sx={{ bgcolor: "#f06292", borderRadius: 1 }}
          >
            + Nuevo curso
          </Button>
        </Link>
      </Box>

      {loadingCursos ? (
        <LoadingScreen message='Cargando Lista de Cursos' />
      ) : (
        <>
          <Grid container spacing={3}>
            {cursos.map((curso) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={curso.id}>
                <TarjetaCurso
                  curso={curso}
                  onEdit={() => handleEdit(curso)} // Dispara el onEdit
                  onDelete={() => eliminarCurso(curso.id, curso.titulo)}
                />
              </Grid>
            ))}
            {cursos.length === 0 && (
              <Typography sx={{ mt: 2, ml: 3 }}>
                Aún no has registrado cursos.
              </Typography>
            )}
          </Grid>
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
                refreshCursos={refreshCursos} // Para recargar la lista automáticamente
              />
            </Dialog>
          )}
        </>
      )}

      {/* El Modal de Alta */}
    </Box>
  );
};

export default GestionCursos;
