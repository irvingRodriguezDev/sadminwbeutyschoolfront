import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import {
  PointOfSale as PaymentIcon,
  Badge as BadgeIcon,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material";
import { useInscriptions } from "../../../context/InscriptionsContext";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { alerts } from "../../../utils/alerts";

const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  lightBg: "#FFF9FA",
};

const AddNewPaymentModal = ({ open, onClose, enrollmentData, schoolId }) => {
  const { addNewPayment } = useInscriptions();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Campos del Formulario
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Cálculos de saldo basados en la inscripción recibida
  const totalAmount = Number(enrollmentData?.total_amount || 0);
  const currentPaid = Number(enrollmentData?.calculated_total_payment || 0);
  const remainingBalance = totalAmount - currentPaid;

  // Sugerir liquidar el total restante al abrir el modal
  useEffect(() => {
    if (open && remainingBalance > 0) {
      setAmount(remainingBalance);
    }
    setError(null);
  }, [open, remainingBalance]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentAmount = Number(amount);

    // 🔒 Validación preventiva en Frontend antes de golpear el Trigger de la Base de Datos
    if (paymentAmount <= 0) {
      setError("❌ El monto del abono debe ser mayor a $0 MXN.");
      return;
    }

    if (paymentAmount > remainingBalance) {
      setError(
        `❌ No puedes cobrar de más. El saldo restante máximo a liquidar es de ${FormatCurrency(remainingBalance)}.`,
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    const paymentPayload = {
      amount: paymentAmount,
      payment_method: paymentMethod,
      notes: notes || `Abono manual registrado desde el panel de control.`,
    };

    // Llamamos a la función de tu InscriptionsContext global
    const result = await addNewPayment(
      enrollmentData.id,
      schoolId,
      paymentPayload,
    );

    if (result.success) {
      alerts.success("El pago se ha registrado exitosamente!");
      handleClose();
    } else {
      // Captura el mensaje personalizado de error devuelto por la EXCEPTION del Trigger de Postgres
      setError(result.error || "Ocurrió un error al procesar el pago.");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setPaymentMethod("cash");
    setNotes("");
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xs'
      fullWidth
      sx={{ borderRadius: "24px" }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          pt: 3,
          bgcolor: "#F06292",
        }}
      >
        💰 Registrar Abono / Pago
      </DialogTitle>

      <Box component='form' onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ backgroundColor: COLORS.lightBg }}>
          {error && (
            <Alert
              severity='error'
              sx={{ mb: 2.5, borderRadius: "14px", fontSize: "0.85rem" }}
            >
              {error}
            </Alert>
          )}

          {/* Resumen del Estado de Cuenta de la Alumna */}
          {enrollmentData && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: "16px",
                border: "1px solid rgba(240, 98, 146, 0.15)",
                mb: 3,
              }}
            >
              <Typography
                variant='caption'
                color='textSecondary'
                display='block'
                sx={{ fontWeight: 700 }}
              >
                ALUMN@:
              </Typography>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 800, color: COLORS.dark, mb: 1.5 }}
              >
                {enrollmentData.students?.name} —{" "}
                <em style={{ color: "#F06292" }}>
                  {enrollmentData.cursos?.titulo}
                </em>
              </Typography>

              <Divider sx={{ my: 1, borderStyle: "dashed" }} />

              <Stack
                direction='row'
                sx={{ mt: 1, justifyContent: "space-between" }}
              >
                <Typography variant='caption' color='textSecondary'>
                  Total Curso:
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ fontWeight: 700, color: COLORS.dark }}
                >
                  {FormatCurrency(totalAmount)}
                </Typography>
              </Stack>
              <Stack
                direction='row'
                sx={{ mt: 0.5, justifyContent: "space-between" }}
              >
                <Typography variant='caption' color='textSecondary'>
                  Abonado a la fecha:
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {FormatCurrency(currentPaid)}
                </Typography>
              </Stack>
              <Stack
                direction='row'
                sx={{ mt: 0.5, justifyContent: "space-between" }}
              >
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 800, color: COLORS.dark }}
                >
                  Saldo Restante:
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 900, color: "error.main" }}
                >
                  {FormatCurrency(remainingBalance)}
                </Typography>
              </Stack>
            </Box>
          )}

          <Grid container spacing={2.5}>
            {/* Input de Monto */}
            <Grid size={12}>
              <TextField
                fullWidth
                type='number'
                label='Monto a Cobrar'
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>$</InputAdornment>
                    ),
                    endAdornment: <WalletIcon sx={{ color: COLORS.primary }} />,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    "&.Mui-focused fieldset": { borderColor: COLORS.accent },
                  },
                }}
              />
            </Grid>

            {/* Selector de Método Físico */}
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label='Método de Recepción'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "14px" },
                }}
              >
                <MenuItem value='cash'>💵 Efectivo (Caja Chica)</MenuItem>
                <MenuItem value='card_terminal'>
                  💳 Terminal Física del Local
                </MenuItem>
              </TextField>
            </Grid>

            {/* Notas Comprobantes */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Notas o Referencia'
                placeholder='Ej. Abono para segundo pago, pago con tarjeta Visa...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "14px" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, backgroundColor: "#fff" }}>
          <Button
            onClick={handleClose}
            sx={{ color: "#777", fontWeight: 700, textTransform: "none" }}
          >
            Cerrar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={submitting || remainingBalance <= 0}
            startIcon={<PaymentIcon />}
            sx={{
              background: "linear-gradient(90deg, #E2208C 0%, #F06292 100%)",
              borderRadius: "12px",
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0px 6px 15px rgba(226, 32, 140, 0.15)",
              "&:hover": {
                background: "linear-gradient(90deg, #A81464 0%, #E2208C 100%)",
              },
            }}
          >
            {submitting ? "Procesando..." : "Registrar Pago"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddNewPaymentModal;
