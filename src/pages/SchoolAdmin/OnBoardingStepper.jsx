import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import { alerts } from "../../utils/alerts";
import { supabase } from "../../config/supabaseClient";

const steps = [
  "Identidad de la Academia",
  "Configuración de Pagos",
  "Finalizar",
];

const OnboardingStepper = ({ schoolId, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [logo, setLogo] = useState(null);
  const [stripeKey, setStripeKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Función interna para subir el logo al Storage
  const uploadLogoProcess = async () => {
    if (!logo) return null;

    try {
      const fileExt = logo.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`; // Usamos Date.now() para evitar duplicados
      const filePath = `${schoolId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-logos")
        .upload(filePath, logo);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("school-logos").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error subiendo logo:", error.message);
      return null;
    }
  };

  const handleNext = async () => {
    // Validación de seguridad para el paso de Stripe
    if (activeStep === 1 && !stripeKey.trim()) {
      alerts.error(
        "Campo Requerido",
        "Debes configurar tu llave de Stripe para poder procesar pagos de cursos.",
      );
      return;
    }

    if (activeStep === steps.length - 1) {
      await guardarConfiguracion();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const guardarConfiguracion = async () => {
    setIsSaving(true);
    try {
      // 1. Intentar subir el logo si existe
      const logoUrl = await uploadLogoProcess();

      // 2. Preparar objeto de actualización
      const updates = {
        stripe_public_key: stripeKey.trim(),
        updated_at: new Date(),
      };
      if (logoUrl) {
        updates.logo_url = logoUrl;
      }

      // 3. Guardar en la tabla 'schools'
      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", schoolId);

      if (error) throw error;

      alerts.success(
        "¡Bienvenida!",
        "La configuración de tu academia se ha completado con éxito.",
      );

      onComplete();
    } catch (error) {
      alerts.error("Error al finalizar", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4, height: "100vdh" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ "& .MuiStepLabel-label": { color: "#f06292" } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(240, 98, 146, 0.2)",
        }}
      >
        {activeStep === 0 && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant='h6' mb={1} fontWeight='bold'>
              Imagen de tu Academia
            </Typography>
            <Typography variant='body2' color='textSecondary' mb={3}>
              Este logo aparecerá en tus cursos y diplomas.
            </Typography>

            <Button
              variant='outlined'
              component='label'
              sx={{
                color: "#f06292",
                borderColor: "#f06292",
                borderRadius: "10px",
                px: 4,
                "&:hover": {
                  borderColor: "#d81b60",
                  bgcolor: "rgba(240, 98, 146, 0.05)",
                },
              }}
            >
              {logo ? "Cambiar Logo" : "Seleccionar Logo"}
              <input
                type='file'
                hidden
                accept='image/*'
                onChange={(e) => setLogo(e.target.files[0])}
              />
            </Button>

            {logo && (
              <Box mt={2}>
                <Typography
                  variant='caption'
                  color='primary'
                  fontWeight='medium'
                >
                  ✓ {logo.name} seleccionado
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant='h6' mb={1} fontWeight='bold'>
              Configuración de Stripe
            </Typography>
            <Typography variant='body2' color='textSecondary' mb={3}>
              Ingresa tu Clave Pública (Publishable Key) para activar los pagos.
            </Typography>
            <TextField
              fullWidth
              label='Stripe Public Key'
              placeholder='pk_test_...'
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              variant='outlined'
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='h6' mb={2} fontWeight='bold'>
              ¿Todo listo?
            </Typography>
            <Typography variant='body1'>
              Al hacer clic en finalizar, activaremos todas las funciones de
              administración para tu escuela.
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
            pt: 2,
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Button
            disabled={activeStep === 0 || isSaving}
            onClick={() => setActiveStep((prev) => prev - 1)}
            sx={{ mr: 1, color: "#666" }}
          >
            Atrás
          </Button>
          <Button
            variant='contained'
            disabled={isSaving}
            onClick={handleNext}
            sx={{
              bgcolor: "#f06292",
              borderRadius: "10px",
              px: 4,
              "&:hover": { bgcolor: "#d81b60" },
              boxShadow: "0 4px 14px 0 rgba(240, 98, 146, 0.39)",
            }}
          >
            {isSaving ? (
              <CircularProgress size={24} color='inherit' />
            ) : activeStep === steps.length - 1 ? (
              "Finalizar"
            ) : (
              "Siguiente"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingStepper;
