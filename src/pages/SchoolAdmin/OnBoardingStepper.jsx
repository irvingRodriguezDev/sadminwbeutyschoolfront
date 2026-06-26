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
  Divider,
} from "@mui/material";

import { useOutletContext } from "react-router-dom"; // 🌟 IMPORTANTE: Para comunicar con el layout padre
import { alerts } from "../../utils/alerts";
import { supabase } from "../../config/supabaseClient";
import LocationPicker from "./LocationPiker";
import StepperOne from "./Stepper/StepperOne";
import StepperTwo from "./Stepper/StepperTwo";
import StepperThree from "./Stepper/StepperThree";
import LoadingInitial from "./Stepper/LoadingInitial";
import ButtonActions from "./Stepper/ButtonActions";
const steps = [
  "Identidad de la Academia",
  "Configuración de Pagos",
  "Finalizar",
];

const OnboardingStepper = ({ schoolId, schoolName, onComplete }) => {
  // 🌟 Extraemos la función inyectada por el Outlet de tu DashboardLayout
  const outletContext = useOutletContext();
  const handleCompleteOnboarding = outletContext?.handleCompleteOnboarding;

  // Intentamos recuperar el paso guardado por si Stripe recarga la app completa
  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem("onboarding_step");
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const logoUrlOnLocal = localStorage.getItem("logourl");
  const [logoUrl, setLogoUrl] = useState(logoUrlOnLocal || "");
  const [isSubiendoLogo, setIsSubiendoLogo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreparando, setIsPreparando] = useState(false);
  // Estado temporal de Stripe en memoria local del asistente
  const [stripeConnected, setStripeConnected] = useState(() => {
    return localStorage.getItem("stripe_connected_local") === "true";
  });

  const [locationData, setLocationData] = useState(() => {
    const savedLocation = localStorage.getItem("locationData");
    if (savedLocation) {
      try {
        return JSON.parse(savedLocation);
      } catch (e) {
        console.error(e);
      }
    }
    return { address: "", lat: null, lng: null };
  });

  // Guardar el paso actual en almacenamiento local para mitigar la redirección de Stripe
  useEffect(() => {
    localStorage.setItem("onboarding_step", activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    if (locationData.address !== "") {
      localStorage.setItem("locationData", JSON.stringify(locationData));
    }
  }, [locationData]);

  // Detectar regreso de Stripe
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const accountId = queryParams.get("account_id");

    if (success === "true" && accountId) {
      setStripeConnected(true);
      localStorage.setItem("stripe_connected_local", "true");
      localStorage.setItem("temp_stripe_account_id", accountId);

      setActiveStep(1); // Lo mantenemos firmemente en el paso de pagos

      // Limpiamos la URL de forma limpia
      window.history.replaceState({}, document.title, window.location.pathname);

      alerts.success(
        "Cuenta Vinculada",
        "Stripe se ha configurado correctamente en este asistente. Por favor, continúa al siguiente paso.",
      );
    }
  }, []);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSubiendoLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${schoolId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("school-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("school-logos").getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      localStorage.setItem("logourl", publicUrl);

      alerts.success("Imagen Lista", "El logo se ha cargado correctamente.");
    } catch (error) {
      console.error(error);
      alerts.error("Error", "No se pudo cargar el logo.");
    } finally {
      setIsSubiendoLogo(false);
    }
  };

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Antes de irnos a Stripe, guardamos que estamos en el paso 1
      localStorage.setItem("needsOnBoarding", "true");

      const { data, error } = await supabase.functions.invoke(
        "stripe-connect",
        {
          body: { schoolId, schoolName, email: user.email },
        },
      );

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      alerts.error("Error", "No se pudo iniciar la conexión con Stripe.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNext = async () => {
    // 🌟 CORRECCIÓN: Ahora validamos logo y dirección obligatoria
    if (activeStep === 0) {
      if (!logoUrl) {
        alerts.error(
          "Campo requerido",
          "Por favor sube el logo de la academia.",
        );
        return;
      }
      if (!locationData.address || !locationData.lat) {
        alerts.error(
          "Campo requerido",
          "Por favor selecciona la ubicación exacta en el mapa.",
        );
        return;
      }
    }

    if (activeStep === 1 && !stripeConnected) {
      alerts.error("Paso requerido", "Debes vincular tu cuenta de Stripe.");
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
      const tempAccountId = localStorage.getItem("temp_stripe_account_id");

      const updates = {
        address: locationData.address,
        location: `POINT(${locationData.lng} ${locationData.lat})`,
        logo_url: logoUrl,
        stripe_account_id: tempAccountId || null,
        stripe_onboarding_complete: tempAccountId ? true : false,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", schoolId);

      if (error) throw error;

      // 🚀 PASO 1: Activamos la hermosa pantalla de transición
      setIsSaving(false);
      setIsPreparando(true);

      // 🧹 Limpieza de memoria local habitual
      localStorage.setItem("needsOnBoarding", "false");
      localStorage.removeItem("locationData");
      localStorage.removeItem("logourl");
      localStorage.removeItem("onboarding_step");
      localStorage.removeItem("stripe_connected_local");
      localStorage.removeItem("temp_stripe_account_id");

      // ⏳ PASO 2: Le damos 3 segundos de transición para deleite visual
      setTimeout(() => {
        // Desmonta el onboarding de forma reactiva y abre el menú lateral
        if (handleCompleteOnboarding) {
          handleCompleteOnboarding();
        }
        if (onComplete) onComplete();
      }, 3500);
    } catch (error) {
      setIsSaving(false);
      alerts.error("Error", error.message);
    }
  };
  // 🌟 Si está preparando la experiencia, mostramos esta vista a pantalla completa
  if (isPreparando) {
    return <LoadingInitial />;
  }

  // Abajo continúa tu "return ( <Box sx={{ width: "100%", mt: 2 }}> ..." original intacto
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ "& .MuiStepLabel-label": { fontWeight: 600 } }}>
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
          borderRadius: "16px",
          border: "1px solid rgba(240, 98, 146, 0.15)",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* PASO 0: IDENTIDAD */}
        {activeStep === 0 && (
          <StepperOne
            logoUrl={logoUrl}
            handleLogoChange={handleLogoChange}
            locationData={locationData}
            setLocationData={setLocationData}
            isSubiendoLogo={isSubiendoLogo}
          />
        )}

        {/* PASO 1: STRIPE */}
        {activeStep === 1 && (
          <StepperTwo
            stripeConnected={stripeConnected}
            isConnecting={isConnecting}
            handleStripeConnect={handleStripeConnect}
          />
        )}

        {/* PASO 2: CONFIRMACIÓN */}
        {activeStep === 2 && <StepperThree />}

        {/* BOTONES DE CONTROL */}
        <ButtonActions
          steps={steps}
          isSubiendoLogo={isSubiendoLogo}
          activeStep={activeStep}
          isSaving={isSaving}
          stripeConnected={stripeConnected}
          handleNext={handleNext}
          setActiveStep={setActiveStep}
        />
      </Paper>
    </Box>
  );
};

export default OnboardingStepper;
