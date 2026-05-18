import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { alerts } from "../../utils/alerts";
import { supabase } from "../../config/supabaseClient";
import LocationPicker from "./LocationPiker";

const steps = [
  "Identidad de la Academia",
  "Configuración de Pagos",
  "Finalizar",
];

const OnboardingStepper = ({ schoolId, schoolName, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [logo, setLogo] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [locationData, setLocationData] = useState(() => {
    const savedLocation = localStorage.getItem("locationData");

    // Si existe en el storage, lo parseamos de string a objeto
    if (savedLocation) {
      try {
        return JSON.parse(savedLocation);
      } catch (e) {
        console.error("Error al parsear ubicación de localStorage", e);
      }
    }

    // Si no hay nada o hay error, valor por defecto
    return {
      address: "",
      lat: null,
      lng: null,
    };
  });
  if (locationData.address !== "") {
    localStorage.setItem("locationData", JSON.stringify(locationData));
  }
  // 1. Detectar el regreso de Stripe mediante la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const accountId = queryParams.get("account_id");

    if (success === "true" && accountId) {
      setStripeConnected(true);
      setActiveStep(1); // Asegurarnos de que esté en el paso de pagos

      // Limpiamos la URL para que no se quede el query string
      window.history.replaceState({}, document.title, window.location.pathname);

      alerts.success(
        "Cuenta Vinculada",
        "Stripe se ha configurado correctamente.",
      );

      // Actualizamos inmediatamente en la DB que el onboarding de stripe terminó
      actualizarEstadoStripe(accountId);
    }
  }, []);

  const actualizarEstadoStripe = async (accountId) => {
    await supabase
      .from("schools")
      .update({
        stripe_account_id: accountId,
        stripe_onboarding_complete: true,
      })
      .eq("id", schoolId);
  };

  const uploadLogoProcess = async () => {
    if (!logo) return null;
    try {
      const fileExt = logo.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
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

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Invocamos la Edge Function que creamos
      const { data, error } = await supabase.functions.invoke(
        "stripe-connect",
        {
          body: {
            schoolId,
            schoolName,
            email: user.email,
          },
        },
      );

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alerts.error("Error", "No se pudo iniciar la conexión con Stripe.");
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === 1 && !stripeConnected) {
      alerts.error(
        "Paso requerido",
        "Debes vincular tu cuenta de Stripe para continuar.",
      );
      return;
    }

    if (activeStep === steps.length - 1) {
      await finalizarConfiguracion();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const finalizarConfiguracion = async () => {
    setIsSaving(true);
    try {
      const logoUrl = await uploadLogoProcess();
      const updates = {
        address: locationData.address,
        location: `POINT(${locationData.lat} ${locationData.lng})`,
        logo_url: logoUrl,
        updated_at: new Date(),
      };

      if (logoUrl) updates.logo_url = logoUrl;

      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", schoolId);

      if (error) throw error;

      alerts.success("¡Configuración Exitosa!", "Tu academia está lista.");
      localStorage.removeItem("locationData");
      onComplete();
    } catch (error) {
      alerts.error("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
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
              Identidad Visual
            </Typography>
            <Typography variant='body2' color='textSecondary' mb={3}>
              Sube el logo de tu academia para personalizar tus cursos.
            </Typography>
            <Button
              variant='outlined'
              component='label'
              sx={{ color: "#f06292", borderColor: "#f06292" }}
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
              <Typography
                variant='caption'
                display='block'
                mt={2}
                color='primary'
              >
                ✓ {logo.name}
              </Typography>
            )}
            <Box>
              {/* Componente del Logo que ya tenías */}
              <Typography variant='h6' sx={{ mt: 3, fontWeight: "bold" }}>
                Dirección de la Academia
              </Typography>

              <LocationPicker
                onLocationSelect={(data) => {
                  setLocationData(data);
                  console.log("Ubicación capturada:", data);
                }}
              />

              {locationData.address && (
                <Typography
                  variant='caption'
                  sx={{ mt: 1, display: "block", color: "#f06292" }}
                >
                  📍 {locationData.address}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ textAlign: "center" }}>
            {!stripeConnected ? (
              <>
                <AccountBalanceIcon
                  sx={{ fontSize: 60, color: "#F06292", mb: 2 }}
                />
                <Typography variant='h6' mb={1} fontWeight='bold'>
                  Pagos con Stripe
                </Typography>
                <Typography variant='body2' color='textSecondary' mb={3}>
                  Para recibir los pagos de tus alumnas, necesitamos conectar tu
                  cuenta bancaria a través de Stripe Express.
                </Typography>
                <Button
                  variant='contained'
                  onClick={handleStripeConnect}
                  disabled={isConnecting}
                  sx={{
                    bgcolor: "#F06292",
                    "&:hover": { bgcolor: "#F06292" },
                    borderRadius: "10px",
                    px: 4,
                  }}
                >
                  {isConnecting ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    "Vincular mi cuenta"
                  )}
                </Button>
              </>
            ) : (
              <Box>
                <CheckCircleIcon
                  sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
                />
                <Typography variant='h6' color='#4caf50' fontWeight='bold'>
                  ¡Cuenta Conectada!
                </Typography>
                <Typography variant='body2' mt={1}>
                  Stripe ha verificado tu conexión exitosamente.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='h6' mb={2} fontWeight='bold'>
              Confirmación Final
            </Typography>
            <Typography variant='body1'>
              Tu academia ya tiene logo y sistema de pagos activado. ¡Es hora de
              empezar!
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
            sx={{ mr: 1 }}
          >
            Atrás
          </Button>
          <Button
            variant='contained'
            onClick={handleNext}
            disabled={isSaving || (activeStep === 1 && !stripeConnected)}
            sx={{
              bgcolor: "#f06292",
              "&:hover": { bgcolor: "#d81b60" },
              borderRadius: "10px",
              px: 4,
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
