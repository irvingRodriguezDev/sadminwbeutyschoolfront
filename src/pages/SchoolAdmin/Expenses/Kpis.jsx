import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { TrendingDown, ReceiptLong } from "@mui/icons-material";
import { useExpenses } from "../../../context/ExpensesContext";
const Kpis = () => {
  const { totalSpendLast30Days, expenses } = useExpenses();
  return (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "rgba(229, 56, 136, 0.1)",
                color: "#E53888",
              }}
            >
              <TrendingDown sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant='caption'
                sx={{ color: "#6B6567", fontWeight: 600 }}
              >
                TOTAL GASTADO (30 DIAS)
              </Typography>
              <Typography
                variant='h5'
                fontWeight={800}
                sx={{ color: "#2A2628" }}
              >
                {FormatCurrency(totalSpendLast30Days)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "rgba(33, 150, 243, 0.1)",
                color: "#2196F3",
              }}
            >
              <ReceiptLong sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant='caption'
                sx={{ color: "#6B6567", fontWeight: 600 }}
              >
                TRANSACCIONES TOTALES
              </Typography>
              <Typography
                variant='h5'
                fontWeight={800}
                sx={{ color: "#2A2628" }}
              >
                {expenses.length} registros
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Kpis;
