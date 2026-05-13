import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { Link } from "react-router-dom";

const GestionCursos = () => {
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

      {/* {loadingSchool ? (
        <LoadingScreen message='Cargando Cursos' />
      ) : (
        <Grid container spacing={3}>
          {salones.map((salon) => (
            <Grid item xs={12} sm={6} md={4} key={salon.id}>
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
              Aún no has registrado cursos.
            </Typography>
          )}
        </Grid>
      )} */}

      {/* El Modal de Alta */}
    </Box>
  );
};

export default GestionCursos;
