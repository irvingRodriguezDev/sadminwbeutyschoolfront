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
                            : p.payment_method === "stripe_online"
                              ? "🌐 Stripe"
                              : p.payment_method === "bank_transfer" &&
                                "📲 Transferencia Bancaria"
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
                  // 💥 REEMPLAZO CLAVE: Cambiamos <Box> por un <Stack> y le decimos que renderice como "span"
                  // Al ser un "span" a nivel HTML, respeta las reglas de no meter bloques dentro de un párrafo <p>
                  <>
                    {p.notes && (
                      <Typography
                        variant='caption'
                        display='block'
                        component='span' // 💡 Evita que este Typography cree otro párrafo interno
                        sx={{
                          color: "text.primary",
                          fontStyle: "italic",
                          mt: 0.2,
                        }}
                      >
                        "{p.notes}"
                      </Typography>
                    )}
                    <br />
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      display='block'
                      component='span' // 💡 Evita que este Typography cree otro párrafo interno
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
                  </>
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
