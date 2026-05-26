import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewInscriptionModal from "./NewInscriptionModal";
import { useAuth } from "../../../context/AuthContext";
import { useInscriptions } from "../../../context/InscriptionsContext";
import InscriptionsList from "./InscriptionsList";

const GestionInscripciones = () => {
  const { profile } = useAuth(); // Asegúrate de tener el schoolId en el perfil
  const { enrollments, fetchEnrollments, loading } = useInscriptions(); // Traemos las inscripciones del contexto

  useEffect(() => {
    if (profile?.school_id) {
      fetchEnrollments(profile.school_id);
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant='h4' fontWeight='bold'>
          Mis Inscripciones
        </Typography>
        <Link
          to={`/crear-inscripcion/${profile?.school_id}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            variant='contained'
            sx={{ bgcolor: "#f06292", borderRadius: 1 }}
          >
            + Nueva Inscripción
          </Button>
        </Link>
      </Box>
      <Grid container spacing={2}>
        <InscriptionsList
          enrollments={enrollments}
          loading={loading}
          schoolId={profile?.school_id}
        />
      </Grid>
    </Box>
  );
};

export default GestionInscripciones;
