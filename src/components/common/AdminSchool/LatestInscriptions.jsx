import React from "react";
import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
// 🌟 Importamos la ilustración para el estado vacío
import NoInscriptionsSvg from "../../../assets/stripe_payments.svg";

const LatestInscriptions = ({ ultimasInscripciones = [] }) => {
  // 🚀 VALIDACIÓN: ¿Contiene información el listado de inscripciones?
  const hasInscriptions =
    ultimasInscripciones && ultimasInscripciones.length > 0;

  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant='h6' fontWeight='bold' mb={hasInscriptions ? 3 : 1}>
          Últimas Inscripciones
        </Typography>

        {hasInscriptions ? (
          /* 🎓 RENDER CON INSCRIPCIONES RECIENTES */
          <Stack spacing={3}>
            {ultimasInscripciones.map((inscription, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  sx={{
                    bgcolor: i % 2 === 0 ? "#E21D8C" : "#E21D8C",
                    fontWeight: "bold",
                  }}
                >
                  {inscription.initial}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {inscription.studentName}
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Inscrita en: {inscription.courseName}
                  </Typography>
                </Box>

                {/* 🌟 MEJORA: inline-flex con gap para alinear perfectamente los iconos y textos */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor:
                      inscription.status === "Pagado" ? "#E8F5E9" : "#E1F5FE",
                    color:
                      inscription.status === "Pagado" ? "#2e7d32" : "#0288d1",
                    padding: "6px 12px",
                    borderRadius: "8px",
                  }}
                >
                  {inscription.status === "Pagado" ? (
                    <CheckCircleIcon sx={{ fontSize: "16px" }} />
                  ) : (
                    <HourglassTopIcon sx={{ fontSize: "16px" }} />
                  )}
                  <Typography variant='caption' fontWeight='bold'>
                    {inscription.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          /* 👥 RENDER ESTADO VACÍO (EMPTY STATE) */
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: 2,
              animation: "fadeIn 0.6s ease-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(8px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {/* Contenedor responsivo para la ilustración */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 160,
                mb: 2,
                opacity: 0.85,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={NoInscriptionsSvg}
                alt='Sin inscripciones recientes'
                style={{ width: "100%", height: "auto" }}
              />
            </Box>

            <Typography
              variant='subtitle1'
              fontWeight='bold'
              sx={{ color: "#1a1a1a", mb: 0.5 }}
            >
              Aún no hay inscripciones
            </Typography>

            <Typography
              variant='caption'
              color='textSecondary'
              sx={{ maxWidth: 280, lineHeight: 1.4 }}
            >
              Cuando las manicuristas comiencen a registrarse en tus cursos y
              talleres, verás el historial en tiempo real aquí.
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default LatestInscriptions;
