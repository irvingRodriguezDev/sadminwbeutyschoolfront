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
  Skeleton,
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

// 🌸 Paleta de colores Premium del ecosistema Floreciendo Juntas
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2A2628",
  borderPink: "rgba(240, 98, 146, 0.12)",
};

const STATUS_CONFIG = {
  completed: {
    label: "Liquidado",
    color: "#4caf50",
    bg: "#e8f5e9",
    icon: <PaidIcon sx={{ fontSize: "14px" }} />,
  },
  active: {
    label: "Apartado",
    color: "#0288d1",
    bg: "#e1f5fe",
    icon: <PendingIcon sx={{ fontSize: "14px" }} />,
  },
  pending_payment: {
    label: "Pendiente",
    color: "#ed6c02",
    bg: "#fff3e0",
    icon: <PendingIcon sx={{ fontSize: "14px" }} />,
  },
  cancelled: {
    label: "Cancelado",
    color: "#d32f2f",
    bg: "#ffebee",
    icon: null,
  },
};

// =========================================================================
// 📱 SUB-COMPONENTE: CARD RESPONSIVA (Visible únicamente en Mobile/Tablet)
// =========================================================================
const InscriptionCardMobile = ({ row, onOpenPayment, onOpenDetail }) => {
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
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "18px",
        border: `1px solid ${COLORS.borderPink}`,
        background: "#FFFFFF",
        mb: 2,
        boxShadow: "0px 4px 12px rgba(242, 32, 140, 0.015)",
      }}
    >
      {/* Cabecera: Info Alumna y Estatus */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        mb={2}
      >
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <Avatar
            sx={{
              bgcolor: COLORS.primary,
              fontWeight: 700,
              fontSize: "0.85rem",
              width: 36,
              height: 36,
            }}
          >
            {inicialNombre}
          </Avatar>
          <Box>
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 800, color: COLORS.dark, lineHeight: 1.2 }}
            >
              {student.name || "Alumno Desconocido"}
            </Typography>
            <Stack
              direction='row'
              spacing={0.5}
              sx={{ color: "text.secondary", alignItems: "center", mt: 0.25 }}
            >
              <WhatsAppIcon sx={{ fontSize: 13, color: "#25D366" }} />
              <Typography variant='caption'>
                {student.phone || "Sin teléfono"}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Chip
          icon={currentStatus.icon}
          label={currentStatus.label}
          size='small'
          sx={{
            backgroundColor: currentStatus.bg,
            color: currentStatus.color,
            fontWeight: 700,
            fontSize: "0.7rem",
            borderRadius: "8px",
            "& .MuiChip-icon": { color: currentStatus.color },
          }}
        />
      </Stack>

      {/* Info Curso */}
      <Box sx={{ mb: 2, pl: 0.5 }}>
        <Typography
          variant='body2'
          sx={{ fontWeight: 700, color: COLORS.dark }}
        >
          {curso.titulo || "Curso"}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'
          display='block'
          sx={{ mt: 0.25 }}
        >
          📍 {curso.salones?.nombre || "Salón General"}
        </Typography>
      </Box>

      {/* Progreso de Pago */}
      <Box sx={{ bgcolor: "#FAFAFA", p: 1.5, borderRadius: "12px", mb: 2 }}>
        <Stack direction='row' justifyContent='space-between' mb={0.5}>
          <Typography
            variant='caption'
            sx={{ fontWeight: 700, color: COLORS.accent }}
          >
            Progreso: {Math.round(porcentajePago)}%
          </Typography>
          <Typography
            variant='caption'
            color='textSecondary'
            sx={{ fontWeight: 500 }}
          >
            {FormatCurrency(pagado)} de {FormatCurrency(total)}
          </Typography>
        </Stack>
        <LinearProgress
          variant='determinate'
          value={porcentajePago}
          sx={{
            height: 5,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.04)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
            },
          }}
        />
        <Typography
          variant='caption'
          sx={{
            fontWeight: 800,
            display: "block",
            mt: 1,
            textAlign: "right",
            color: restante > 0 ? "error.main" : "success.main",
          }}
        >
          {restante > 0
            ? `Resta: ${FormatCurrency(restante)}`
            : "¡Liquidado por completo! ✨"}
        </Typography>
      </Box>

      {/* Botones de Acción Mobile */}
      <Stack direction='row' spacing={1} justifyContent='flex-end'>
        <IconButton
          size='small'
          onClick={() => onOpenDetail(row)}
          sx={{
            flexGrow: restante > 0 ? 0 : 1,
            color: COLORS.dark,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "10px",
            py: 0.75,
            px: 2,
          }}
        >
          <ViewIcon fontSize='small' sx={{ mr: restante > 0 ? 0 : 0.5 }} />
          {restante <= 0 && (
            <Typography variant='caption' fontWeight={700}>
              Ver Detalles
            </Typography>
          )}
        </IconButton>

        {restante > 0 && (
          <IconButton
            size='small'
            onClick={() => onOpenPayment(row)}
            sx={{
              flexGrow: 1,
              color: "#fff",
              backgroundColor: COLORS.primary,
              borderRadius: "10px",
              py: 0.75,
              px: 2,
              "&:hover": { backgroundColor: COLORS.accent },
            }}
          >
            <AddPaymentIcon fontSize='small' sx={{ mr: 0.5 }} />
            <Typography variant='caption' fontWeight={700}>
              Abonar en Caja
            </Typography>
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
};

// =========================================================================
// 💻 SUB-COMPONENTE: FILA DE LA TABLA (Desktop & Tablet Landscape)
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
        "&:hover": { backgroundColor: "rgba(240, 98, 146, 0.015)" },
        transition: "background-color 0.2s ease",
      }}
    >
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
// 🏛️ COMPONENTE PRINCIPAL EXPORTADO
// =========================================================================
const InscriptionsList = ({
  enrollments = [],
  loading,
  isFiltering,
  schoolId,
}) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [detailEnrollment, setDetailEnrollment] = useState(null);

  // 🌀 RENDER SKELETONS (Para mitigar estados de carga de manera limpia)
  if (loading) {
    return (
      <Box sx={{ mt: 3 }}>
        {/* Skeleton en Mobile */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant='rounded'
              height={190}
              sx={{ mb: 2, borderRadius: "18px" }}
            />
          ))}
        </Box>
        {/* Skeleton en Desktop */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Skeleton
            variant='rounded'
            height={320}
            sx={{ borderRadius: "24px" }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        transition: "opacity 0.2s ease-in-out",
        opacity: isFiltering ? 0.5 : 1,
        pointerEvents: isFiltering ? "none" : "auto",
      }}
    >
      {/* 📱 VISTA EN SMARTPHONES Y TABLETS (xs y sm) */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {enrollments.length === 0 ? (
          <Paper
            sx={{ p: 4, textAlign: "center", borderRadius: "18px" }}
            elevation={0}
          >
            <Typography
              variant='body2'
              color='textSecondary'
              sx={{ fontStyle: "italic" }}
            >
              No hay alumnas inscritas en este bloque todavía.
            </Typography>
          </Paper>
        ) : (
          enrollments.map((row) => (
            <InscriptionCardMobile
              key={row.id}
              row={row}
              onOpenPayment={setSelectedEnrollment}
              onOpenDetail={setDetailEnrollment}
            />
          ))
        )}
      </Box>

      {/* 💻 VISTA EN ESCRITORIO (md en adelante) */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          display: { xs: "none", md: "block" },
          borderRadius: "24px",
          border: `1px solid ${COLORS.borderPink}`,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9FA 100%)",
          boxShadow: "0px 15px 40px rgba(242, 32, 140, 0.02)",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: "rgba(240, 98, 146, 0.03)" }}>
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
      </TableContainer>

      {/* MODALES DE CONTROL (Globales para evitar redundancia de estados) */}
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
    </Box>
  );
};

export default InscriptionsList;
