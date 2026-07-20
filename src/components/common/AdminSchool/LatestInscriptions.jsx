import React from "react";
import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import NoInscriptionsSvg from "../../../assets/stripe_payments.svg";

const LatestInscriptions = ({ ultimasInscripciones = [] }) => {
  const hasInscriptions =
    ultimasInscripciones && ultimasInscripciones.length > 0;

  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 }, // Padding compacto en móvil para optimizar espacio
          borderRadius: "24px", // Consistencia premium con bordes suaves
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #F3E8EE",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant='h6'
          fontWeight={800}
          color='#2A2628'
          mb={hasInscriptions ? 2.5 : 1}
        >
          Últimas Inscripciones
        </Typography>

        {hasInscriptions ? (
          /* 🎓 RENDER CON INSCRIPCIONES RECIENTES */
          <Stack spacing={2.5}>
            {ultimasInscripciones.map((inscription, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  // 🌟 RESPONSIVE WRAP: Si el contenido es gigante en pantallas mini (iPhone SE), se adapta sin romperse
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: { xs: 1.5, sm: 2 },
                  pb: 2,
                  borderBottom:
                    i !== ultimasInscripciones.length - 1
                      ? "1px dashed #FDF2F8"
                      : "none", // División limpia entre registros
                }}
              >
                {/* Bloque Alumna e Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Avatar
                    sx={{
                      // 🌟 Alternancia sutil de color usando el branding rosa para que se vea dinámico
                      bgcolor: i % 2 === 0 ? "#E53888" : "#FCE4EC",
                      color: i % 2 === 0 ? "#FFFFFF" : "#E53888",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      width: 40,
                      height: 40,
                      boxShadow: "0 2px 8px rgba(229, 56, 136, 0.1)",
                    }}
                  >
                    {inscription.initial}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant='subtitle2'
                      fontWeight={700}
                      color='#2A2628'
                      noWrap={false} // Permitimos que baje de renglón si es nombre compuesto largo
                      sx={{ lineHeight: 1.2, mb: 0.25 }}
                    >
                      {inscription.studentName}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden", // Limita a 1 línea el nombre del curso si es excesivamente largo
                      }}
                    >
                      En:{" "}
                      <span style={{ fontWeight: 600, color: "#554D4F" }}>
                        {inscription.courseName}
                      </span>
                    </Typography>
                  </Box>
                </Box>

                {/* Status Tag */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor:
                      inscription.status === "Pagado" ? "#E8F5E9" : "#FFF8E1", // Tono ámbar más cálido para pendientes
                    color:
                      inscription.status === "Pagado" ? "#2E7D32" : "#F57F17",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    alignSelf: { xs: "flex-end", sm: "center" }, // En móvil se recarga a la derecha para un look app móvil nativa
                    flexShrink: 0,
                  }}
                >
                  {inscription.status === "Pagado" ? (
                    <CheckCircleIcon sx={{ fontSize: "14px" }} />
                  ) : (
                    <HourglassTopIcon sx={{ fontSize: "14px" }} />
                  )}
                  <Typography
                    variant='caption'
                    fontWeight={800}
                    sx={{ fontSize: "0.65rem", letterSpacing: 0.3 }}
                  >
                    {inscription.status.toUpperCase()}
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
              py: 4,
              animation: "fadeIn 0.6s ease-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(8px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 140,
                mb: 2.5,
                opacity: 0.9,
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
              fontWeight={700}
              sx={{ color: "#2A2628", mb: 0.5 }}
            >
              Aún no hay inscripciones
            </Typography>

            <Typography
              variant='caption'
              color='textSecondary'
              sx={{ maxWidth: 260, lineHeight: 1.4, px: 2 }}
            >
              Cuando las manicuristas comiencen a registrarse en tus cursos,
              verás el historial en tiempo real aquí.
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default LatestInscriptions;
