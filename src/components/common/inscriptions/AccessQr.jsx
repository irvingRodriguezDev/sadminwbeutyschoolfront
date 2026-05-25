import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import { FormatCurrency } from "../../../utils/FormatCurrency";
const AccessQr = ({ enrollmentData, isLiquidado, restante, COLORS }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 1,
      }}
    >
      {isLiquidado ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "24px",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.02)",
          }}
        >
          <QRCodeSVG
            value={enrollmentData.id}
            size={150}
            fgColor={COLORS.dark}
            level='H'
          />
          <Stack
            direction='row'
            spacing={0.5}
            alignItems='center'
            justifyContent='center'
            sx={{ mt: 1.5, color: "success.main" }}
          >
            <CheckCircleIcon fontSize='small' />
            <Typography
              variant='caption'
              sx={{ fontWeight: 800, letterSpacing: "0.5px" }}
            >
              PASAPORTE ACTIVO PARA ACCESO
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            bgcolor: "#fafafa",
            borderRadius: "24px",
            border: "1px dashed #ccc",
            width: "100%",
            maxWidth: 240,
          }}
        >
          <LockIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Pase QR Bloqueado
          </Typography>
          <Typography
            variant='caption'
            color='textSecondary'
            display='block'
            sx={{ mt: 0.5 }}
          >
            El código de acceso se liberará de forma automática en cuanto la
            alumna liquide los {FormatCurrency(restante)} pendientes en caja.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AccessQr;
