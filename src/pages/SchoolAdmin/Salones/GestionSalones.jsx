import React, { useState } from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import { useSchool } from "../../../context/SchoolContext";
import AltaSalon from "./AltaSalon";
import EditarSalon from "./EditarSalon";
import { alerts } from "../../../utils/alerts";
import { supabase } from "../../../config/supabaseClient";

const GestionSalones = () => {
  const { salones, loadingSchool, refreshSchoolData } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [editarSalon, setEditarSalon] = useState(null);
  const handleAbrirEditor = (salon) => {
    setOpenEditar(true);
    setEditarSalon(salon);
  };
  const handleDeleteSalon = async (salonId) => {
    const result = await alerts.confirm(
      "¿Eliminar Salón?",
      "Esta acción no se puede deshacer y podría afectar a los cursos vinculados.",
    );

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from("salones")
          .delete()
          .eq("id", salonId);

        if (error) throw error;

        alerts.success("Eliminado", "El salón ha sido borrado correctamente.");
        refreshSchoolData(); // Función de tu SchoolContext
      } catch (error) {
        alerts.error("Error al eliminar", error.message);
      }
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant='h4' fontWeight='bold'>
          Mis Salones
        </Typography>
        <Button
          variant='contained'
          onClick={() => setModalOpen(true)}
          sx={{ bgcolor: "#f06292", borderRadius: 1 }}
        >
          + Nuevo Salón
        </Button>
      </Box>

      {loadingSchool ? (
        <Typography>Cargando salones...</Typography>
      ) : (
        <Grid container spacing={3}>
          {salones.map((salon) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={salon.id}>
              <Paper
                sx={{ p: 3, borderRadius: 1, borderLeft: "5px solid #f06292" }}
              >
                <Typography variant='h6'>{salon.nombre}</Typography>
                <Typography color='textSecondary'>
                  Capacidad: {salon.capacidad} alumnas
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    size='small'
                    variant='outlined'
                    color='info'
                    onClick={() => handleAbrirEditor(salon)} // Función que setea el salón seleccionado y abre el modal
                  >
                    Editar
                  </Button>
                  <Button
                    size='small'
                    variant='outlined'
                    color='error'
                    onClick={() => handleDeleteSalon(salon.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
          {salones.length === 0 && (
            <Typography sx={{ mt: 2, ml: 3 }}>
              Aún no has registrado salones.
            </Typography>
          )}
        </Grid>
      )}

      {/* El Modal de Alta */}
      <AltaSalon open={modalOpen} onClose={() => setModalOpen(false)} />
      {editarSalon && (
        <EditarSalon
          open={openEditar}
          onClose={() => setEditarSalon(false)}
          salon={editarSalon}
        />
      )}
    </Box>
  );
};

export default GestionSalones;
