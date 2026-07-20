import React from "react";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import NoActivitiesSvg from "../../../assets/no_activities.svg";
import ClassIcon from "../../Icons/ClassIcon";
import TimeIcon from "../../Icons/TimeIcon";
import CalendarIcon from "../../Icons/CalendarIcon";

const ActivitiesToday = ({ actividadesHoy = [] }) => {
  const hasActivities = actividadesHoy && actividadesHoy.length > 0;

  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 }, // Menos padding en móvil para ganar área de contenido
          borderRadius: "24px", // Bordes más suaves estilo UI moderna
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #F3E8EE",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant='h6'
          fontWeight={800} // Un toque más bold corporativo
          color='#2A2628'
          mb={hasActivities ? 2.5 : 1}
        >
          Actividad para Hoy
        </Typography>

        {hasActivities ? (
          <Stack spacing={2}>
            {actividadesHoy.map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: "#fdf7f9",
                  display: "flex",
                  // 🌟 RESPONSIVE LAYOUT: En móvil se apila verticalmente, en desktop mantiene fila
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  border: "1px solid rgba(240, 98, 146, 0.12)",
                  boxShadow: "0 4px 12px rgba(240, 98, 146, 0.02)",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(240, 98, 146, 0.05)",
                  },
                }}
              >
                {/* Posicionamiento del Chip en móvil arriba a la derecha de forma sutil */}
                <Box
                  sx={{
                    order: { xs: -1, sm: 2 },
                    width: { xs: "100%", sm: "auto" },
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                  }}
                >
                  <Chip
                    label={item.type.toUpperCase()}
                    size='small'
                    sx={{
                      bgcolor: item.type === "Taller" ? "#e1f5fe" : "#fce4ec",
                      color: item.type === "Taller" ? "#0288d1" : "#f06292",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: 0.5,
                      borderRadius: "6px",
                    }}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  {/* TÍTULO */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ClassIcon
                      width={16}
                      height={16}
                      style={{ color: "#f06292", flexShrink: 0 }}
                    />
                    <Typography
                      variant='subtitle1'
                      fontWeight={700}
                      color='#2A2628'
                      sx={{ lineHeight: 1.3 }}
                    >
                      {item.title}
                    </Typography>
                  </Box>

                  {/* HORARIO Y SALÓN */}
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{
                      mt: 1,
                      alignItems: "center",
                      flexWrap: "wrap",
                      rowGap: 0.5,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <TimeIcon
                        width={14}
                        height={14}
                        style={{ color: "#6B6567" }}
                      />
                      <Typography
                        variant='caption'
                        color='textSecondary'
                        fontWeight={500}
                      >
                        {item.time}
                      </Typography>
                    </Box>

                    <FiberManualRecord sx={{ fontSize: 5, color: "#f06292" }} />

                    <Typography
                      variant='caption'
                      color='primary'
                      fontWeight={700}
                    >
                      {item.classroom}
                    </Typography>
                  </Stack>

                  {/* FECHAS DEL CURSO */}
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ mt: 0.75, alignItems: "center" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarIcon
                        width={14}
                        height={14}
                        style={{ color: "#6B6567" }}
                      />
                      <Typography
                        variant='caption'
                        color='textSecondary'
                        fontWeight={500}
                      >
                        Del{" "}
                        <span style={{ color: "#2A2628", fontWeight: 600 }}>
                          {item.fecha_inicio}
                        </span>{" "}
                        al{" "}
                        <span style={{ color: "#2A2628", fontWeight: 600 }}>
                          {item.fecha_fin}
                        </span>
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          /* 🏖️ RENDER ESTADO VACÍO (EMPTY STATE) */
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
                src={NoActivitiesSvg}
                alt='Sin actividades hoy'
                style={{ width: "100%", height: "auto" }}
              />
            </Box>

            <Typography
              variant='subtitle1'
              fontWeight={700}
              sx={{ color: "#2A2628", mb: 0.5 }}
            >
              No tienes actividades hoy
            </Typography>

            <Typography
              variant='caption'
              color='textSecondary'
              sx={{ maxWidth: 240, lineHeight: 1.4, px: 2 }}
            >
              Hoy es un día tranquilo para planificar. Las clases agendadas
              aparecerán justo aquí.
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default ActivitiesToday;
