import {
  AccountBalanceWallet,
  PictureAsPdf,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const KpisInformativos = ({ selectedCourseReport }) => {
  return (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: "18px",
            border: "1px solid rgba(16, 185, 129, 0.1)",
            bgcolor: "rgba(16, 185, 129, 0.02)",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.1)",
                color: "#10B981",
              }}
            >
              <AccountBalanceWallet />
            </Avatar>
            <Box>
              <Typography variant='caption' color='#6B6567' fontWeight={600}>
                INGRESOS BRUTOS
              </Typography>
              <Typography variant='h6' fontWeight={800} color='#10B981'>
                {FormatCurrency(selectedCourseReport.totalIngresos)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: "18px",
            border: "1px solid rgba(239, 68, 68, 0.1)",
            bgcolor: "rgba(239, 68, 68, 0.02)",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
              }}
            >
              <PictureAsPdf />
            </Avatar>
            <Box>
              <Typography variant='caption' color='#6B6567' fontWeight={600}>
                GASTOS ASOCIADOS
              </Typography>
              <Typography variant='h6' fontWeight={800} color='#EF4444'>
                {FormatCurrency(selectedCourseReport.totalGastos)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: "18px",
            border: "1px solid rgba(229, 56, 136, 0.15)",
            bgcolor: "rgba(229, 56, 136, 0.03)",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(229, 56, 136, 0.1)",
                color: "#E53888",
              }}
            >
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant='caption' color='#6B6567' fontWeight={600}>
                UTILIDAD NETA
              </Typography>
              <Typography variant='h6' fontWeight={800} color='#E53888'>
                {FormatCurrency(selectedCourseReport.utilidadNeta)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default KpisInformativos;
