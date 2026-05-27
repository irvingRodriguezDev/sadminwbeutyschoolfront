import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import {
  MeetingRoom,
  AutoStories,
  People,
  CalendarMonth,
} from "@mui/icons-material";
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
const CardsDashboard = ({ metrics }) => {
  return (
    <Grid container spacing={3} mb={4}>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
        <StatCard
          title='Salones Creados'
          value={metrics.salonesCount}
          icon={<MeetingRoom />}
          color='#7b1fa2'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
        <StatCard
          title='Cursos Activos'
          value={metrics.cursosActivosCount}
          icon={<AutoStories />}
          color='#f06292'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
        <StatCard
          title='Total Alumnos'
          value={metrics.totalAlumnosCount}
          icon={<People />}
          color='#2196f3'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
        <StatCard
          title='Próximos Talleres'
          value={metrics.proximosTalleresCount}
          icon={<CalendarMonth />}
          color='#4caf50'
        />
      </Grid>
    </Grid>
  );
};

export default CardsDashboard;
