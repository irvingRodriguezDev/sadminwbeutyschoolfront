import React from "react";
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";

// =========================================================================
// 📱 SUB-COMPONENTE: CARD RESPONSIVA (Móviles y Tablets)
// =========================================================================
const DebtorCardMobile = ({ row, handleWhatsAppCobro }) => {
  const porcentajeLiquidado = (row.totalPaid / row.totalCourse) * 100;

  // Color dinámico de la barra según qué tan rezagada esté la alumna
  const progressBarColor = porcentajeLiquidado < 30 ? "#d32f2f" : "#ed6c02";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "18px",
        border: "1px solid rgba(211, 47, 47, 0.12)", // Un sutil toque rojizo de alerta controlada
        background: "#FFFFFF",
        mb: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.01)",
      }}
    >
      {/* Fila Superior: Identidad y Saldo Pendiente */}
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
          <Typography
            variant='caption'
            color='textSecondary'
            display='block'
            sx={{ mt: 0.5 }}
          >
            {row.studentPhone || "Sin teléfono"}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 900, color: "#d32f2f" }}
          >
            {FormatCurrency(row.debt)}
          </Typography>
          <Typography variant='caption' color='textSecondary'>
            De {FormatCurrency(row.totalCourse)}
          </Typography>
        </Box>
      </Stack>

      {/* Curso Pendiente */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant='caption' color='textSecondary' display='block'>
          CURSO / TALLER AGENDADO
        </Typography>
        <Typography
          variant='body2'
          sx={{ fontWeight: 700, color: "#554D4F", mt: 0.25 }}
        >
          {row.courseTitle}
        </Typography>
      </Box>

      {/* Progreso de Amortización */}
      <Box sx={{ bgcolor: "#FAFAFA", p: 1.5, borderRadius: "12px", mb: 2 }}>
        <Stack direction='row' justifyContent='space-between' mb={0.5}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Abonado{" "}
          </Typography>
          <Typography
            variant='caption'
            sx={{ fontWeight: 800, color: progressBarColor }}
          >
            {" "}
            {Math.round(porcentajeLiquidado)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant='determinate'
          value={porcentajeLiquidado}
          sx={{
            height: 5,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.04)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor: progressBarColor,
            },
          }}
        />
      </Box>

      {/* Botón WhatsApp de Acción Primaria Exclusivo Móvil */}
      <Button
        variant='contained'
        fullWidth
        startIcon={<WhatsAppIcon />}
        onClick={() => handleWhatsAppCobro(row)}
        sx={{
          backgroundColor: "#25D366",
          color: "#fff",
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "0 4px 10px rgba(37, 211, 102, 0.15)",
          "&:hover": {
            backgroundColor: "#20ba56",
            boxShadow: "none",
          },
        }}
      >
        Enviar Recordatorio
      </Button>
    </Paper>
  );
};

// =========================================================================
// 🏛️ COMPONENTE PRINCIPAL (Unificado Híbrido)
// =========================================================================
const Cobrance = ({ debtors = [], COLORS, handleWhatsAppCobro }) => {
  return (
    <Box>
      {/* 📱 VISTA MÓVIL (Pantallas xs y sm) */}
      <Box sx={{ display: { xs: "block", md: "none" }, p: 1 }}>
        {debtors.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{ fontStyle: "italic" }}
            >
              ✨ ¡Felicidades! No hay cuentas pendientes por cobrar actualmente.
            </Typography>
          </Box>
        ) : (
          debtors.map((row) => (
            <DebtorCardMobile
              key={row.enrollmentId}
              row={row}
              handleWhatsAppCobro={handleWhatsAppCobro}
            />
          ))
        )}
      </Box>

      {/* 💻 VISTA ESCRITORIO (Se mantiene intacta de md en adelante) */}
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
              <TableCell sx={{ pl: 3 }}>Alumna Morosa</TableCell>
              <TableCell>Taller / Curso Pendiente</TableCell>
              <TableCell>Progreso Financiero</TableCell>
              <TableCell align='right'>Saldo pendiente</TableCell>
              <TableCell align='center' sx={{ pr: 3 }}>
                Recordatorio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debtors.length === 0 ? (
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
                  ✨ ¡Felicidades! No hay cuentas pendientes por cobrar
                  actualmente.
                </TableCell>
              </TableRow>
            ) : (
              debtors.map((row) => {
                const porcentajeLiquidado =
                  (row.totalPaid / row.totalCourse) * 100;
                return (
                  <TableRow
                    key={row.enrollmentId}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.01)",
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
                        {row.studentPhone || "Sin teléfono"}
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
                    <TableCell sx={{ width: "220px" }}>
                      <Box sx={{ width: "100%" }}>
                        <Stack
                          direction='row'
                          sx={{ justifyContent: "space-between", mb: 0.5 }}
                        >
                          <Typography
                            variant='caption'
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                          >
                            {Math.round(porcentajeLiquidado)}% Pagado
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant='determinate'
                          value={porcentajeLiquidado}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(0,0,0,0.04)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              backgroundColor:
                                porcentajeLiquidado < 30
                                  ? "error.main"
                                  : "warning.main",
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 800, color: "error.main" }}
                      >
                        {FormatCurrency(row.debt)}
                      </Typography>
                      <Typography variant='caption' color='textSecondary'>
                        De {FormatCurrency(row.totalCourse)}
                      </Typography>
                    </TableCell>
                    <TableCell align='center' sx={{ pr: 3 }}>
                      <Tooltip title='Enviar Recordatorio por WhatsApp'>
                        <IconButton
                          onClick={() => handleWhatsAppCobro(row)}
                          sx={{
                            color: "#25D366",
                            backgroundColor: "rgba(37, 211, 102, 0.06)",
                            "&:hover": {
                              backgroundColor: "#25D366",
                              color: "#fff",
                            },
                          }}
                          size='small'
                        >
                          <WhatsAppIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
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

export default Cobrance;
