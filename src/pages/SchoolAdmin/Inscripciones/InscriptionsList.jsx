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
import LoadingScreen from "../../../components/common/LoadingScreen";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import InscriptionDetail from "./InscriptionDetail";
// Paleta de colores Premium / Luxury del ecosistema
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  lightBg: "#FFF9FA",
  borderPink: "rgba(240, 98, 146, 0.15)",
};

const InscriptionsList = ({ enrollments, loading, schoolId }) => {
  // Renderizador de etiquetas de estatus con estética suave (Soft Chips)
  const renderStatusChip = (status) => {
    const config = {
      completed: {
        label: "Liquidado",
        color: "#4caf50",
        bg: "#e8f5e9",
        icon: <PaidIcon size='small' />,
      },
      active: {
        label: "Apartado",
        color: "#0288d1",
        bg: "#e1f5fe",
        icon: <PendingIcon size='small' />,
      },
      pending_payment: {
        label: "Pendiente",
        color: "#ed6c02",
        bg: "#fff3e0",
        icon: <PendingIcon size='small' />,
      },
      cancelled: {
        label: "Cancelado",
        color: "#d32f2f",
        bg: "#ffebee",
        icon: null,
      },
    };

    const current = config[status] || config.pending_payment;

    return (
      <Chip
        icon={current.icon}
        label={current.label}
        sx={{
          backgroundColor: current.bg,
          color: current.color,
          fontWeight: 700,
          borderRadius: "10px",
          "& .MuiChip-icon": { color: current.color },
        }}
      />
    );
  };
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const onOpenPaymentModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setSelectedEnrollment(null);
    setIsPaymentModalOpen(false);
  };

  //estados para controlar la apertura del modal de detalle de la inscripción
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailEnrollment, setDetailEnrollment] = useState(null);

  const onOpenDetail = (enrollment) => {
    setDetailEnrollment(enrollment);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailEnrollment(null);
    setIsDetailOpen(false);
  };

  if (loading) {
    return <LoadingScreen message='Cargando inscripciones...' />;
  }

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
      }}
    >
      <Table sx={{ minWidth: 800 }} aria-label='tabla de inscripciones premium'>
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
            <TableCell
              sx={{ fontWeight: 800, color: COLORS.dark, align: "right" }}
            >
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
            enrollments.map((row) => {
              const total = Number(row.total_amount || 0);
              const pagado = Number(row.calculated_total_payment || 0);
              const restante = total - pagado;
              const porcentajePago =
                total > 0 ? Math.min((pagado / total) * 100, 100) : 0;
              const inicialNombre = row.students
                ? row.students.name.charAt(0).toUpperCase()
                : "A";

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(240, 98, 146, 0.02)" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* ALUMNA (Avatar + Info Principal) */}
                  <TableCell sx={{ pl: 3 }}>
                    <Stack
                      direction='row'
                      sx={{ alignItems: "center" }}
                      spacing={2}
                    >
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
                          {row.students
                            ? row.students.name
                            : "Alumno Desconocido"}
                        </Typography>
                        <Stack
                          direction='row'
                          spacing={0.5}
                          sx={{
                            color: "text.secondary",
                            cursor: "pointer",
                            alignItems: "center",
                          }}
                        >
                          <WhatsAppIcon
                            sx={{ fontSize: 14, color: "#25D366" }}
                          />
                          <Typography variant='caption'>
                            {row.students ? row.students.phone : "Sin teléfono"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* CURSO ASOCIADO */}
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 700, color: COLORS.dark }}
                    >
                      {row.cursos?.titulo || "Curso Glitz"}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      📍{row.cursos?.salones?.nombre || "Salón General"}
                    </Typography>
                  </TableCell>

                  {/* ESTATUS DE INSCRIPCIÓN */}
                  <TableCell>{renderStatusChip(row.status)}</TableCell>

                  {/* BARRA DE PROGRESO DE PAGO */}
                  <TableCell>
                    <Box sx={{ width: "100%" }}>
                      <Stack
                        direction='row'
                        sx={{ justifyContent: "space-between", mb: 0.5 }}
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

                  {/* BALANCE (Restante por pagar) */}
                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 800,
                        color: restante > 0 ? "error.main" : "success.main",
                      }}
                    >
                      {restante > 0
                        ? `Debe ${FormatCurrency(restante)}`
                        : "Liquidado ✨"}
                    </Typography>
                  </TableCell>

                  {/* ACCIONES DE CONTROL */}
                  <TableCell sx={{ pr: 3 }}>
                    <Stack
                      direction='row'
                      spacing={1}
                      sx={{ justifyContent: "center" }}
                    >
                      {/* Botón rápido para Abonar Dinero si aún debe */}
                      {restante > 0 && (
                        <Tooltip title='Registrar Abono en Caja'>
                          <IconButton
                            size='small'
                            onClick={() => onOpenPaymentModal(row)}
                            sx={{
                              color: COLORS.primary,
                              backgroundColor: "rgba(240, 98, 146, 0.06)",
                              "&:hover": {
                                backgroundColor: COLORS.primary,
                                color: "#fff",
                              },
                            }}
                          >
                            <AddPaymentIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Botón para ver historial de transacciones o QR */}
                      <Tooltip title='Ver Detalles e Historial'>
                        <IconButton
                          size='small'
                          onClick={() => onOpenDetail(row)}
                          sx={{
                            color: COLORS.dark,
                            border: "1px solid rgba(0,0,0,0.08)",
                            "&:hover": {
                              backgroundColor: COLORS.dark,
                              color: "#fff",
                            },
                          }}
                        >
                          <ViewIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {selectedEnrollment && (
        <AddNewPaymentModal
          open={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          enrollmentData={selectedEnrollment}
          schoolId={schoolId}
        />
      )}
      {detailEnrollment && (
        <InscriptionDetail
          open={isDetailOpen}
          onClose={handleCloseDetail}
          enrollmentData={detailEnrollment}
        />
      )}
    </TableContainer>
  );
};

export default InscriptionsList;
