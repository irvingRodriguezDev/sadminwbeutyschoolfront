import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { FormatCurrency } from "../../../utils/FormatCurrency";
const FinancyData = ({ total, pagado, restante, COLORS }) => {
  return (
    <Box>
      <Typography
        variant='subtitle2'
        sx={{ fontWeight: 800, color: COLORS.dark, mb: 1.5 }}
      >
        Resumen de Cuenta
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f5f5f5",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <Typography variant='caption' color='textSecondary'>
              Costo
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 800 }}>
              {FormatCurrency(total)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "success.radial",
              backgroundColor: "#e8f5e9",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <Typography variant='caption' color='success.main'>
              Abonado
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontWeight: 800, color: "success.main" }}
            >
              {FormatCurrency(pagado)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: restante > 0 ? "#ffebee" : "#e8f5e9",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <Typography
              variant='caption'
              color={restante > 0 ? "error.main" : "success.main"}
            >
              Restante
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 800,
                color: restante > 0 ? "error.main" : "success.main",
              }}
            >
              {FormatCurrency(restante)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancyData;
