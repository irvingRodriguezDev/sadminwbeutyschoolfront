import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { FiberManualRecord } from "@mui/icons-material";
const ActivitiesToday = ({ actividadesHoy }) => {
  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
        <Typography variant='h6' fontWeight='bold' mb={3}>
          Actividad para Hoy
        </Typography>
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
                <Typography variant='subtitle1' fontWeight='bold'>
                  {item.title}
                </Typography>
                <Stack
                  direction='row'
                  spacing={1}
                  sx={{ mt: 0.5, alignItems: "center" }}
                >
                  <Typography variant='caption' color='textSecondary'>
                    {item.time}
                  </Typography>
                  <FiberManualRecord sx={{ fontSize: 6, color: "#f06292" }} />
                  <Typography
                    variant='caption'
                    color='primary'
                    fontWeight='bold'
                  >
                    {item.classroom}
                  </Typography>
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
      </Paper>
    </Grid>
  );
};

export default ActivitiesToday;
