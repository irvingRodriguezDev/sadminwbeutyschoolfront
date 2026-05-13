import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  MeetingRoom,
  AutoStories,
  People,
  CalendarMonth,
  FiberManualRecord,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Reutilizamos una versión local del StatCard para mantener el estilo
const StatCard = ({ title, value, icon, color }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(240, 98, 146, 0.05)",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: `${color}15`,
          color: color,
          display: "flex",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant='caption'
          color='textSecondary'
          fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {title}
        </Typography>
        <Typography variant='h5' fontWeight='bold' sx={{ color: "#333" }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);

const SchoolAdminDashboard = () => {
  const { profile } = useAuth();

  return (
    <Box>
      {/* Saludo Inicial */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight='bold' color='#333'>
          ¡Hola, {profile?.nombre?.split(" ")[0]}! 👋
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          Esto es lo que sucede hoy en tu institución.
        </Typography>
      </Box>

      {/* Fila de Estadísticas Rápidas */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
          <StatCard
            title='Salones'
            value='4'
            icon={<MeetingRoom />}
            color='#7b1fa2'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
          <StatCard
            title='Cursos Activos'
            value='8'
            icon={<AutoStories />}
            color='#f06292'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
          <StatCard
            title='Total Alumnos'
            value='124'
            icon={<People />}
            color='#2196f3'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
          <StatCard
            title='Próximos Talleres'
            value='3'
            icon={<CalendarMonth />}
            color='#4caf50'
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Próximas Clases / Talleres */}
        <Grid size={{ xs: 12, sm: 7, md: 7, lg: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
            <Typography variant='h6' fontWeight='bold' mb={3}>
              Actividad para Hoy
            </Typography>
            <Stack spacing={2}>
              {[
                {
                  name: "Taller de Uñas Polygel",
                  time: "10:00 AM - 12:00 PM",
                  room: "Salón A",
                  type: "taller",
                },
                {
                  name: "Manicure Rusa Avanzada",
                  time: "02:00 PM - 05:00 PM",
                  room: "Salón B",
                  type: "curso",
                },
                {
                  name: "Estructuras de Salón",
                  time: "06:00 PM - 08:00 PM",
                  room: "Salón A",
                  type: "curso",
                },
              ].map((item, i) => (
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
                    <Typography variant='subtitle1' fontWeight='bold'>
                      {item.name}
                    </Typography>
                    <Stack
                      direction='row'
                      spacing={1}
                      alignItems='center'
                      mt={0.5}
                    >
                      <Typography variant='caption' color='textSecondary'>
                        {item.time}
                      </Typography>
                      <FiberManualRecord
                        sx={{ fontSize: 6, color: "#f06292" }}
                      />
                      <Typography
                        variant='caption'
                        color='primary'
                        fontWeight='bold'
                      >
                        {item.room}
                      </Typography>
                    </Stack>
                  </Box>
                  <Chip
                    label={item.type.toUpperCase()}
                    size='small'
                    sx={{
                      bgcolor: item.type === "taller" ? "#e1f5fe" : "#fce4ec",
                      color: item.type === "taller" ? "#0288d1" : "#f06292",
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Resumen de Alumnos Recientes */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
            <Typography variant='h6' fontWeight='bold' mb={3}>
              Últimas Inscripciones
            </Typography>
            <Stack spacing={3}>
              {[
                "María García",
                "Ana Martínez",
                "Carla Pérez",
                "Sofía López",
              ].map((alumno, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar sx={{ bgcolor: i % 2 === 0 ? "#f06292" : "#7b1fa2" }}>
                    {alumno.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      {alumno}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      Inscrita en: Curso de Nivelación
                    </Typography>
                  </Box>
                  <Typography
                    variant='caption'
                    fontWeight='bold'
                    color='success.main'
                  >
                    Pagado
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant='caption' color='textSecondary'>
                Ocupación Total de Salones
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                75%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchoolAdminDashboard;
