import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
} from "@mui/material";

import { useOutletContext } from "react-router-dom";
import { alerts } from "../../utils/alerts";
import { supabase } from "../../config/supabaseClient";
import StepperOne from "./Stepper/StepperOne";
import StepperTwo from "./Stepper/StepperTwo";
import StepperThree from "./Stepper/StepperThree";
import LoadingInitial from "./Stepper/LoadingInitial";
import ButtonActions from "./Stepper/ButtonActions";

const OnboardingStepper = ({ schoolId, schoolName, onComplete }) => {
  const outletContext = useOutletContext();
  const handleCompleteOnboarding = outletContext?.handleCompleteOnboarding;

  // 1. Estado para almacenar si es franquicia y si está cargando la info inicial
  const [isFranchise, setIsFranchise] = useState(false);
  const [loadingSchoolData, setLoadingSchoolData] = useState(true);

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

  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem("phone") || "";
  });

  const handleChangePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");
    localStorage.setItem("phone", cleanPhone);
    setPhoneNumber(cleanPhone);
  };

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

  // 2. Cargar los datos de la escuela (is_franchise) al montar el componente
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("is_franchise")
          .eq("id", schoolId)
          .single();

        if (error) throw error;
        if (data) {
          setIsFranchise(!!data.is_franchise);
        }
      } catch (error) {
        console.error("Error al consultar datos de la escuela:", error);
      } finally {
        setLoadingSchoolData(false);
      }
    };

    if (schoolId) {
      fetchSchoolDetails();
    }
  }, [schoolId]);

  // 3. Definición dinámica de los pasos
  const steps = isFranchise
    ? ["Identidad de la Academia", "Configuración de Pagos", "Finalizar"]
    : ["Identidad de la Academia", "Finalizar"];

  // Guardar el paso actual en localStorage
  useEffect(() => {
    localStorage.setItem("onboarding_step", activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    if (locationData.address !== "") {
      localStorage.setItem("locationData", JSON.stringify(locationData));
    }
  }, [locationData]);

  // Detectar regreso de Stripe (Solo aplicable si es Franquicia)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get("success");
    const accountId = queryParams.get("account_id");

    if (success === "true" && accountId) {
      setStripeConnected(true);
      localStorage.setItem("stripe_connected_local", "true");
      localStorage.setItem("temp_stripe_account_id", accountId);

      setActiveStep(1); // Mantiene en el paso de Stripe

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

  // 4. Lógica de avance ajustada al flujo dinámico
  const handleNext = async () => {
    // Validaciones del PASO 0 (Identidad)
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
      if (!phoneNumber || phoneNumber.length < 10) {
        alerts.error(
          "Teléfono requerido",
          "Por favor ingresa un número de teléfono de WhatsApp válido (mínimo 10 dígitos).",
        );
        return;
      }
    }

    // Validación del PASO 1 solo si ES FRANQUICIA (Stripe)
    if (isFranchise && activeStep === 1 && !stripeConnected) {
      alerts.error("Paso requerido", "Debes vincular tu cuenta de Stripe.");
      return;
    }

    // Si llegamos al último paso del arreglo, finalizamos
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
        // Si no es franquicia, no guardamos cuenta conectada
        stripe_account_id: isFranchise ? tempAccountId || null : null,
        stripe_onboarding_complete: isFranchise ? !!tempAccountId : true,
        updated_at: new Date(),
        number_phone: phoneNumber || null,
      };

      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", schoolId);

      if (error) throw error;

      setIsSaving(false);
      setIsPreparando(true);

      localStorage.setItem("needsOnBoarding", "false");
      localStorage.removeItem("locationData");
      localStorage.removeItem("logourl");
      localStorage.removeItem("onboarding_step");
      localStorage.removeItem("stripe_connected_local");
      localStorage.removeItem("temp_stripe_account_id");
      localStorage.removeItem("phone");

      setTimeout(() => {
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

  if (loadingSchoolData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isPreparando) {
    return <LoadingInitial />;
  }

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
        {/* PASO 0: IDENTIDAD (Siempre se muestra) */}
        {activeStep === 0 && (
          <StepperOne
            logoUrl={logoUrl}
            handleLogoChange={handleLogoChange}
            locationData={locationData}
            setLocationData={setLocationData}
            isSubiendoLogo={isSubiendoLogo}
            handleChangePhone={handleChangePhone}
            phoneNumber={phoneNumber}
          />
        )}

        {/* PASO STRIPE: Solo si es Franquicia y estamos en el paso 1 */}
        {isFranchise && activeStep === 1 && (
          <StepperTwo
            stripeConnected={stripeConnected}
            isConnecting={isConnecting}
            handleStripeConnect={handleStripeConnect}
          />
        )}

        {/* PASO FINALIZAR: Se muestra en el último paso (Paso 1 para escuela propia, Paso 2 para franquicia) */}
        {((isFranchise && activeStep === 2) ||
          (!isFranchise && activeStep === 1)) && <StepperThree />}

        {/* BOTONES DE CONTROL */}
        <ButtonActions
          steps={steps}
          isSubiendoLogo={isSubiendoLogo}
          activeStep={activeStep}
          isSaving={isSaving}
          stripeConnected={isFranchise ? stripeConnected : true}
          handleNext={handleNext}
          setActiveStep={setActiveStep}
        />
      </Paper>
    </Box>
  );
};

export default OnboardingStepper;
