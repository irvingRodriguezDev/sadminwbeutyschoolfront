import React from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Assignment as NoteIcon,
} from "@mui/icons-material";
import { FormatCurrency } from "../../../utils/FormatCurrency";

// Helper para centralizar la configuración de métodos de pago
const getMethodConfig = (method, COLORS) => {
  switch (method) {
    case "cash":
      return {
        label: "Efectivo",
        bg: "#e8f5e9",
        color: COLORS.success || "#4caf50",
      };
    case "card_terminal":
      return { label: "Terminal TPV", bg: "#E1F5FE", color: "#228CD3" };
    case "stripe_online":
      return { label: "Stripe", bg: "#FFF3E0", color: "#ED6C0E" };
    case "bank_transfer":
      return { label: "Transf. Bancaria", bg: "#FDE0F1", color: "#E8408F" };
    default:
      return { label: "Otros", bg: "#F5F5F5", color: "#6B6567" };
  }
};

// =========================================================================
// 📱 SUB-COMPONENTE: CARD PARA RESPONSIVO (Móviles y Tablets)
// =========================================================================
const IncomingCardMobile = ({ row, COLORS }) => {
  const methodConfig = getMethodConfig(row.method, COLORS);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "16px",
        border: "1px solid rgba(240, 98, 146, 0.12)",
        background: "#FFFFFF",
        mb: 2,
        boxShadow: "0px 4px 12px rgba(242, 32, 140, 0.01)",
      }}
    >
      {/* Fila Superior: Nombre de Alumna y Estatus/Método */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        mb={1.5}
      >
        <Box sx={{ minWidth: 0, pr: 1 }}>
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 800, color: "#2A2628", lineHeight: 1.2 }}
          >
            {row.studentName}
          </Typography>
          <Stack
            direction='row'
            spacing={0.5}
            alignItems='center'
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            <TimeIcon sx={{ fontSize: 13 }} />
            <Typography variant='caption'>
              {new Date(row.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              hrs
            </Typography>
          </Stack>
        </Box>

        <Chip
          label={methodConfig.label}
          size='small'
          sx={{
            fontWeight: 800,
            fontSize: "0.65rem",
            borderRadius: "6px",
            backgroundColor: methodConfig.bg,
            color: methodConfig.color,
            flexShrink: 0,
          }}
        />
      </Stack>

      {/* Fila Central: Concepto o Taller */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant='body2' sx={{ fontWeight: 700, color: "#554D4F" }}>
          {row.courseTitle}
        </Typography>
      </Box>

      {/* Fila Inferior: Notas y Monto Total */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{
          pt: 1.5,
          borderTop: "1px dashed rgba(0,0,0,0.05)",
        }}
      >
        {/* Notas truncadas en mobile si son muy largas */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            maxWidth: "60%",
          }}
        >
          {row.notes && (
            <NoteIcon sx={{ fontSize: 14, color: "text.disabled" }} />
          )}
          <Typography
            variant='caption'
            color='textSecondary'
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.notes || "Sin comentarios"}
          </Typography>
        </Box>

        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 900, color: methodConfig.color }}
        >
          {FormatCurrency(row.amount)}
        </Typography>
      </Stack>
    </Paper>
  );
};

// =========================================================================
// 🏛️ COMPONENTE PRINCIPAL (Unificado Híbrido)
// =========================================================================
const IncomingsToday = ({ transactions = [], COLORS }) => {
  return (
    <Box>
      {/* 📱 VISTA MÓVIL (Se activa en pantallas xs y sm) */}
      <Box sx={{ display: { xs: "block", md: "none" }, p: 1 }}>
        {transactions.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{ fontStyle: "italic" }}
            >
              No se han registrado movimientos de caja el día de hoy.
            </Typography>
          </Box>
        ) : (
          transactions.map((row) => (
            <IncomingCardMobile key={row.id} row={row} COLORS={COLORS} />
          ))
        )}
      </Box>

      {/* 💻 VISTA ESCRITORIO (Se mantiene intacta en md en adelante) */}
      <TableContainer
        sx={{
          display: { xs: "none", md: "block" },
          maxHeight: 500,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(229, 56, 134, 0.2)",
            borderRadius: "10px",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-head": {
                  backgroundColor: "rgba(240, 98, 145, 1)",
                  fontWeight: 800,
                  color: "#fff",
                },
              }}
            >
              <TableCell sx={{ pl: 3 }}>Alumna</TableCell>
              <TableCell>Curso / Concepto</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Notas / Comentarios</TableCell>
              <TableCell align='right' sx={{ pr: 3 }}>
                Monto Recaudado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align='center'
                  sx={{
                    py: 8,
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                >
                  No se han registrado movimientos de caja el día de hoy.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((row) => {
                const config = getMethodConfig(row.method, COLORS);
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(240, 98, 146, 0.015)",
                      },
                    }}
                  >
                    <TableCell sx={{ pl: 3 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{ fontWeight: 800, color: "#2A2628" }}
                      >
                        {row.studentName}
                      </Typography>
                      <Typography variant='caption' color='textSecondary'>
                        {new Date(row.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        hrs
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 600, color: "#554D4F" }}
                      >
                        {row.courseTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={config.label}
                        size='small'
                        sx={{
                          fontWeight: 700,
                          borderRadius: "6px",
                          backgroundColor: config.bg,
                          color: config.color,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='caption'
                        color='textSecondary'
                        sx={{
                          display: "block",
                          maxWidth: 250,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.notes}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        pr: 3,
                        fontWeight: 800,
                        color: config.color,
                      }}
                    >
                      {FormatCurrency(row.amount)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IncomingsToday;
