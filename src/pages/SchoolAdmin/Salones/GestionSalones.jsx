import React, { useState } from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import { useSchool } from "../../../context/SchoolContext";
import AltaSalon from "./AltaSalon";

const GestionSalones = () => {
  const { salones, loadingSchool } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);

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
                sx={{ p: 3, borderRadius: 3, borderLeft: "5px solid #f06292" }}
              >
                <Typography variant='h6'>{salon.nombre}</Typography>
                <Typography color='textSecondary'>
                  Capacidad: {salon.capacidad} alumnas
                </Typography>
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
    </Box>
  );
};

export default GestionSalones;
