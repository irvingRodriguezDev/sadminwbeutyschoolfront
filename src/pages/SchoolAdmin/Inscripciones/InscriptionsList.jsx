import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
  Avatar,
  Stack,
} from "@mui/material";
import {
  AddCard as AddPaymentIcon,
  Visibility as ViewIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as PaidIcon,
  HourglassTop as PendingIcon,
} from "@mui/icons-material";
import AddNewPaymentModal from "./AddNewPaymentModal";
import InscriptionDetail from "./InscriptionDetail";
import { FormatCurrency } from "../../../utils/FormatCurrency";

// 🌸 Paleta de colores Premium del ecosistema
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  borderPink: "rgba(240, 98, 146, 0.15)",
};

// 🚦 CONFIGURACIÓN DE ESTATUS (Sacada del render para que no se recree en memoria)
const STATUS_CONFIG = {
  completed: {
    label: "Liquidado",
    color: "#4caf50",
    bg: "#e8f5e9",
    icon: <PaidIcon sx={{ fontSize: "16px" }} />,
  },
  active: {
    label: "Apartado",
    color: "#0288d1",
    bg: "#e1f5fe",
    icon: <PendingIcon sx={{ fontSize: "16px" }} />,
  },
  pending_payment: {
    label: "Pendiente",
    color: "#ed6c02",
    bg: "#fff3e0",
    icon: <PendingIcon sx={{ fontSize: "16px" }} />,
  },
  cancelled: {
    label: "Cancelado",
    color: "#d32f2f",
    bg: "#ffebee",
    icon: null,
  },
};

// =========================================================================
// 🎒 SUB-COMPONENTE: FILA DE LA TABLA (Mantiene el código del padre limpio)
// =========================================================================
const InscriptionRow = ({ row, onOpenPayment, onOpenDetail }) => {
  const total = Number(row.total_amount || 0);
  const pagado = Number(row.calculated_total_payment || 0);
  const restante = total - pagado;
  const porcentajePago = total > 0 ? Math.min((pagado / total) * 100, 100) : 0;

  const student = row.students || {};
  const curso = row.cursos || {};
  const inicialNombre = student.name
    ? student.name.charAt(0).toUpperCase()
    : "A";
  const currentStatus =
    STATUS_CONFIG[row.status] || STATUS_CONFIG.pending_payment;

  return (
    <TableRow
      sx={{
        "&:hover": { backgroundColor: "rgba(240, 98, 146, 0.02)" },
        transition: "background-color 0.2s ease",
      }}
    >
      {/* ALUMNA */}
      <TableCell sx={{ pl: 3 }}>
        <Stack direction='row' sx={{ alignItems: "center" }} spacing={2}>
          <Avatar
            sx={{
              bgcolor: COLORS.primary,
              fontWeight: 700,
              fontSize: "0.9rem",
              width: 36,
              height: 36,
            }}
          >
            {inicialNombre}
          </Avatar>
          <Box>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 800, color: COLORS.dark }}
            >
              {student.name || "Alumno Desconocido"}
            </Typography>
            <Stack
              direction='row'
              spacing={0.5}
              sx={{ color: "text.secondary", alignItems: "center" }}
            >
              <WhatsAppIcon sx={{ fontSize: 14, color: "#25D366" }} />
              <Typography variant='caption'>
                {student.phone || "Sin teléfono"}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </TableCell>

      {/* CURSO */}
      <TableCell>
        <Typography
          variant='body2'
          sx={{ fontWeight: 700, color: COLORS.dark }}
        >
          {curso.titulo || "Curso"}
        </Typography>
        <Typography variant='caption' color='textSecondary'>
          📍 {curso.salones?.nombre || "Salón General"}
        </Typography>
      </TableCell>

      {/* ESTATUS */}
      <TableCell>
        <Chip
          icon={currentStatus.icon}
          label={currentStatus.label}
          sx={{
            backgroundColor: currentStatus.bg,
            color: currentStatus.color,
            fontWeight: 700,
            borderRadius: "10px",
            "& .MuiChip-icon": { color: currentStatus.color },
          }}
        />
      </TableCell>

      {/* PROGRESO DE PAGO */}
      <TableCell>
        <Box sx={{ width: "100%" }}>
          <Stack
            direction='row'
            sx={{ justifyContent: "space-between" }}
            mb={0.5}
          >
            <Typography
              variant='caption'
              sx={{ fontWeight: 700, color: COLORS.accent }}
            >
              {Math.round(porcentajePago)}%
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              {FormatCurrency(pagado)} de {FormatCurrency(total)}
            </Typography>
          </Stack>
          <LinearProgress
            variant='determinate'
            value={porcentajePago}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(0,0,0,0.04)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              },
            }}
          />
        </Box>
      </TableCell>

      {/* BALANCE */}
      <TableCell>
        <Typography
          variant='body2'
          sx={{
            fontWeight: 800,
            color: restante > 0 ? "error.main" : "success.main",
          }}
        >
          {restante > 0 ? `Debe ${FormatCurrency(restante)}` : "Liquidado ✨"}
        </Typography>
      </TableCell>

      {/* ACCIONES */}
      <TableCell sx={{ pr: 3 }}>
        <Stack direction='row' spacing={1} sx={{ justifyContent: "center" }}>
          {restante > 0 && (
            <Tooltip title='Registrar Abono en Caja'>
              <IconButton
                size='small'
                onClick={() => onOpenPayment(row)}
                sx={{
                  color: COLORS.primary,
                  backgroundColor: "rgba(240, 98, 146, 0.06)",
                  "&:hover": { backgroundColor: COLORS.primary, color: "#fff" },
                }}
              >
                <AddPaymentIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title='Ver Detalles e Historial'>
            <IconButton
              size='small'
              onClick={() => onOpenDetail(row)}
              sx={{
                color: COLORS.dark,
                border: "1px solid rgba(0,0,0,0.08)",
                "&:hover": { backgroundColor: COLORS.dark, color: "#fff" },
              }}
            >
              <ViewIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

// =========================================================================
// 🏛️ COMPONENTE PRINCIPAL EXPORTADO (Ultra Reducido y Fluido)
// =========================================================================
const InscriptionsList = ({ enrollments, isFiltering, schoolId }) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [detailEnrollment, setDetailEnrollment] = useState(null);

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "24px",
        border: `1px solid ${COLORS.borderPink}`,
        background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9FA 100%)",
        boxShadow: "0px 15px 40px rgba(242, 32, 140, 0.03)",
        overflow: "hidden",
        mt: 3,
        // ⚡ EFECTO FLUIDO: Si está filtrando, opacamos suavemente la tabla
        transition: "opacity 0.2s ease-in-out",
        opacity: isFiltering ? 0.6 : 1,
        pointerEvents: isFiltering ? "none" : "auto",
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ backgroundColor: "rgba(240, 98, 146, 0.04)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, color: COLORS.dark, pl: 3 }}>
              Alumn@
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: COLORS.dark }}>
              Curso / Taller
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: COLORS.dark }}>
              Estatus
            </TableCell>
            <TableCell
              sx={{ fontWeight: 800, color: COLORS.dark, width: "180px" }}
            >
              Progreso de Pago
            </TableCell>
            <TableCell sx={{ fontWeight: 800, color: COLORS.dark }}>
              Balance
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 800,
                color: COLORS.dark,
                pr: 3,
                textAlign: "center",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {enrollments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                <Typography
                  variant='body1'
                  color='textSecondary'
                  sx={{ fontStyle: "italic" }}
                >
                  No hay alumnas inscritas en este bloque todavía.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            enrollments.map((row) => (
              <InscriptionRow
                key={row.id}
                row={row}
                onOpenPayment={setSelectedEnrollment}
                onOpenDetail={setDetailEnrollment}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* MODALES DE CONTROL */}
      {selectedEnrollment && (
        <AddNewPaymentModal
          open={Boolean(selectedEnrollment)}
          onClose={() => setSelectedEnrollment(null)}
          enrollmentData={selectedEnrollment}
          schoolId={schoolId}
        />
      )}

      {detailEnrollment && (
        <InscriptionDetail
          open={Boolean(detailEnrollment)}
          onClose={() => setDetailEnrollment(null)}
          enrollmentData={detailEnrollment}
        />
      )}
    </TableContainer>
  );
};

export default InscriptionsList;
