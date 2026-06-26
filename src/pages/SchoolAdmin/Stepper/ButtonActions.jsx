import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";

const ButtonActions = ({
  activeStep,
  isSaving,
  handleNext,
  stripeConnected,
  isSubiendoLogo,
  steps,
  setActiveStep,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        pt: 2,
        borderTop: "1px solid rgba(0,0,0,0.05)",
        mt: "auto",
      }}
    >
      <Button
        disabled={activeStep === 0 || isSaving}
        onClick={() => setActiveStep((prev) => prev - 1)}
        sx={{
          fontWeight: 700,
          textTransform: "none",
          color: "text.secondary",
        }}
      >
        Atrás
      </Button>
      <Button
        variant='contained'
        onClick={handleNext}
        disabled={
          isSaving || isSubiendoLogo || (activeStep === 1 && !stripeConnected)
        }
        disableElevation
        sx={{
          bgcolor: "#E21F8B",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: "10px",
          px: 4,
          "&:hover": { bgcolor: "#E21F8B" },
        }}
      >
        {isSaving ? (
          <CircularProgress size={22} color='inherit' />
        ) : activeStep === steps.length - 1 ? (
          "Finalizar Configuración"
        ) : (
          "Continuar"
        )}
      </Button>
    </Box>
  );
};

export default ButtonActions;
