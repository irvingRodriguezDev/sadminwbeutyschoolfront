import React, { useState } from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import { useSchool } from "../../../context/SchoolContext";
import AltaSalon from "./AltaSalon";
import EditarSalon from "./EditarSalon";
import { alerts } from "../../../utils/alerts";
import { supabase } from "../../../config/supabaseClient";
import EmptySalones from "./EmptySalones";
import SalonCard from "../../../components/common/SalonCard";

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
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant='h4' fontWeight='bold'>
            Mis Salones
          </Typography>
        </Grid>
        <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant='contained'
            onClick={() => setModalOpen(true)}
            sx={{ bgcolor: "#f06292", borderRadius: 1 }}
          >
            + Nuevo Salón
          </Button>
        </Grid>
        {loadingSchool ? (
          <Typography>Cargando salones...</Typography>
        ) : (
          <>
            {salones.map((salon) => (
              <SalonCard
                salon={salon}
                handleAbrirEditor={handleAbrirEditor}
                handleDeleteSalon={handleDeleteSalon}
                index={salon.id}
                key={salon.id}
              />
            ))}
            {salones.length === 0 && (
              <EmptySalones onNuevoSalon={() => setModalOpen(true)} />
            )}
          </>
        )}
        <AltaSalon open={modalOpen} onClose={() => setModalOpen(false)} />
        {editarSalon && (
          <EditarSalon
            open={openEditar}
            onClose={() => setEditarSalon(false)}
            salon={editarSalon}
          />
        )}
      </Grid>
    </>
  );
};

export default GestionSalones;
