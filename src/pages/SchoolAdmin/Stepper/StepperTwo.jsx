import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StepperTwo = ({ stripeConnected, isConnecting, handleStripeConnect }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
        py: 2,
      }}
    >
      {!stripeConnected ? (
        <>
          <AccountBalanceIcon sx={{ fontSize: 50, color: "#E21F8B" }} />
          <Typography variant='h6' sx={{ fontWeight: 800, color: "#1a1a1a" }}>
            Pasarela de Pagos Stripe
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ maxWidth: 450 }}
          >
            Vincula tu cuenta para automatizar las inscripciones y recibir tus
            liquidaciones directo a tu banco.
          </Typography>
          <Button
            variant='contained'
            onClick={handleStripeConnect}
            disabled={isConnecting}
            disableElevation
            sx={{
              bgcolor: "#E21F8B",
              borderRadius: "10px",
              px: 4,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#E21F8B" },
            }}
          >
            {isConnecting ? (
              <CircularProgress size={22} color='inherit' />
            ) : (
              "Conectar cuenta bancaria"
            )}
          </Button>
        </>
      ) : (
        <>
          <CheckCircleIcon sx={{ fontSize: 55, color: "#2e7d32" }} />
          <Typography variant='h6' sx={{ fontWeight: 800, color: "#2e7d32" }}>
            ¡Cuenta de Pagos Lista!
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Stripe Express se ha conectado de forma correcta a tu academia.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default StepperTwo;
