import React from "react";
import { Box, Grid, Paper, Typography, Card, Stack } from "@mui/material";
import {
  School,
  People,
  MonetizationOn,
  TrendingUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
// Nota: Para los gráficos puedes usar 'recharts' que es muy ligero y estético
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSuperAdmin } from "../../context/SuperAdminContext";

const StatCard = ({ title, value, icon, color }) => (
  <motion.div whileHover={{ y: -5 }}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant='body2' color='textSecondary'>
          {title}
        </Typography>
        <Typography variant='h5' fontWeight='bold'>
          {value}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);

const SuperAdminDashboard = () => {
  const { stats, ultimosRegistros, chartData } = useSuperAdmin();
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography
          variant='h4'
          fontWeight='bold'
          sx={{ mb: 4, color: "#333" }}
        >
          Panel de Control Global
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title='Escuelas Activas'
          value={stats.totalEscuelas}
          icon={<School />}
          color='#E21D8C'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title='Total Usuarios'
          value={stats.totalUsuarios}
          icon={<People />}
          color='#E21D8C'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title='Total Cursos'
          value={stats.totalCursos}
          icon={<MonetizationOn />}
          color='#E21D8C'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title='Crecimiento'
          value={stats.crecimientoEscuelas}
          icon={<TrendingUp />}
          color='#E21D8C'
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
          <Typography variant='h6' fontWeight='bold' mb={3}>
            Crecimiento de Instituciones
          </Typography>
          <ResponsiveContainer width='100%' height='80%'>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='name' axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='escuelas'
                stroke='#f06292'
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{ p: 3, borderRadius: 2, height: "auto", overflow: "hidden" }}
        >
          <Typography variant='h6' fontWeight='bold' mb={2}>
            Últimos Registros
          </Typography>
          <Stack spacing={2}>
            {ultimosRegistros.map((registro, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fdf7f9",
                  borderLeft: "4px solid #f06292",
                }}
              >
                <Typography variant='subtitle2' fontWeight='bold'>
                  {registro.name}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  Registrada el:{" "}
                  {new Date(registro.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SuperAdminDashboard;
