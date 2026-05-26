import {
  Box,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const HistoryPayments = ({ loadingPayments, payments, COLORS }) => {
  return (
    <Box>
      <Stack direction='row' spacing={1} sx={{ mb: 1, alignItems: "center" }}>
        <ReceiptIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 800, color: COLORS.dark }}
        >
          Historial de Transacciones
        </Typography>
      </Stack>

      {loadingPayments ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} sx={{ color: COLORS.primary }} />
        </Box>
      ) : payments.length === 0 ? (
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{ fontStyle: "italic" }}
        >
          No se han registrado abonos todavía en esta inscripción.
        </Typography>
      ) : (
        <List disablePadding>
          {payments.map((p, idx) => (
            <ListItem
              key={p.id}
              disableGutters
              sx={{
                py: 1.5,
                borderBottom:
                  idx !== payments.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <ListItemText
                // 🔥 SOLUCIÓN AQUÍ: Forzamos a que el texto secundario use un div semántico en HTML
                secondaryTypographyProps={{ component: "div" }}
                primary={
                  <Stack
                    direction='row'
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 700, color: COLORS.dark }}
                    >
                      {FormatCurrency(p.amount)}
                    </Typography>
                    <Chip
                      label={
                        p.payment_method === "cash"
                          ? "💵 Efectivo"
                          : p.payment_method === "card_terminal"
                            ? "💳 Terminal"
                            : "🌐 Stripe"
                      }
                      size='small'
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        height: 20,
                      }}
                    />
                  </Stack>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      display='block'
                    >
                      📅{" "}
                      {new Date(p.created_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    {p.notes && (
                      <Typography
                        variant='caption'
                        sx={{
                          color: "text.primary",
                          fontStyle: "italic",
                          display: "block",
                          mt: 0.2,
                        }}
                      >
                        "{p.notes}"
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HistoryPayments;
