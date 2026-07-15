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
        sx={{
          p: 3,
          borderRadius: 2,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant='h6' fontWeight='bold' mb={hasActivities ? 3 : 1}>
          Actividad para Hoy
        </Typography>

        {hasActivities ? (
          <Stack spacing={2}>
            {actividadesHoy.map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "#fdf7f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(240, 98, 146, 0.1)",
                }}
              >
                <Box>
                  {/* 🌟 TÍTULO: Alineamos el icono al centro vertical del texto */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ClassIcon
                      width={16}
                      height={16}
                      style={{ color: "#f06292" }}
                    />
                    <Typography variant='subtitle1' fontWeight='bold'>
                      {item.title}
                    </Typography>
                  </Box>

                  {/* 🌟 HORARIO Y SALÓN: Unificado y corregido a 16px para mantener proporción */}
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ mt: 0.75, alignItems: "center" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <TimeIcon width={16} height={16} />
                      <Typography variant='caption' color='textSecondary'>
                        {item.time}
                      </Typography>
                    </Box>

                    <FiberManualRecord sx={{ fontSize: 6, color: "#f06292" }} />

                    <Typography
                      variant='caption'
                      color='primary'
                      fontWeight='bold'
                    >
                      {item.classroom}
                    </Typography>
                  </Stack>

                  {/* 🌟 FECHAS DEL CURSO: Limpio, alineado y estandarizado */}
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ mt: 0.5, alignItems: "center" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarIcon width={16} height={16} />
                      <Typography variant='caption' color='textSecondary'>
                        Del <b>{item.fecha_inicio}</b> al{" "}
                        <b>{item.fecha_fin}</b>
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Chip
                  label={item.type.toUpperCase()}
                  size='small'
                  sx={{
                    bgcolor: item.type === "Taller" ? "#e1f5fe" : "#fce4ec",
                    color: item.type === "Taller" ? "#0288d1" : "#f06292",
                    fontWeight: "bold",
                    fontSize: "0.65rem",
                  }}
                />
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
              py: 2,
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
                maxWidth: 160,
                mb: 2,
                opacity: 0.85,
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
              fontWeight='bold'
              sx={{ color: "#1a1a1a", mb: 0.5 }}
            >
              No tienes actividades registradas
            </Typography>

            <Typography
              variant='caption'
              color='textSecondary'
              sx={{ maxWidth: 260, lineHeight: 1.4 }}
            >
              Hoy es un día tranquilo. Las clases, cursos o talleres agendados
              aparecerán en este bloque.
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default ActivitiesToday;
