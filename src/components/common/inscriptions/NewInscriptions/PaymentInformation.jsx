import {
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { PointOfSale as PaymentIcon } from "@mui/icons-material";
const PaymentInformation = ({ formData, setFormData }) => {
  return (
    <>
      <Grid size={12}>
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
        >
          3. REGISTRO DE PAGO EN CAJA RECEPCIÓN
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          type='number'
          label='Monto Recibido en este acto'
          value={formData.payment_amount}
          onChange={(e) =>
            setFormData({ ...formData, payment_amount: e.target.value })
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
              endAdornment: <PaymentIcon sx={{ color: "#f06292" }} />,
            },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          label='Método de Cobro Físico'
          value={formData.payment_method}
          onChange={(e) =>
            setFormData({ ...formData, payment_method: e.target.value })
          }
        >
          <MenuItem value='cash'>💵 Efectivo (Caja Chica)</MenuItem>
          <MenuItem value='card_terminal'>
            💳 Terminal Bancaria del Plantel
          </MenuItem>
        </TextField>
      </Grid>

      <Grid size={12}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label='Notas internas del cobro'
          placeholder='Ej. Liquidó en efectivo con billetes de $500, entregó comprobante...'
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </Grid>
    </>
  );
};

export default PaymentInformation;
