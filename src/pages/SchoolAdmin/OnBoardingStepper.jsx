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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { useOutletContext } from "react-router-dom"; // 🌟 IMPORTANTE: Para comunicar con el layout padre
import { alerts } from "../../utils/alerts";
import { supabase } from "../../config/supabaseClient";
import LocationPicker from "./LocationPiker";
import BuildWebsiteSvg from "../../assets/build_website.svg";
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
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          p: 4,
          animation: "fadeIn 0.5s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Spinner concéntrico doble estilo Premium SaaS */}
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            mb: 4,
            width: "100%",
            maxWidth: 280,
          }}
        >
          <img
            src={BuildWebsiteSvg}
            alt='Preparando sitio'
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        <Typography
          variant='h5'
          sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1 }}
        >
          Estamos preparando tu experiencia
        </Typography>

        <Typography
          variant='body2'
          sx={{ color: "text.secondary", maxWidth: 360, lineHeight: 1.6 }}
        >
          Configurando salones virtuales, pasarelas de pago y tu nueva identidad
          de marca. Tardará solo unos segundos...
        </Typography>
      </Box>
    );
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <Typography
                variant='h6'
                sx={{ fontWeight: 800, color: "#1a1a1a" }}
              >
                Identidad Visual
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Sube el logo oficial de tu plantel para la emisión de
                certificados.
              </Typography>
            </Box>

            <Button
              variant='outlined'
              component='label'
              disabled={isSubiendoLogo}
              startIcon={
                isSubiendoLogo ? (
                  <CircularProgress size={16} color='inherit' />
                ) : (
                  <CloudUploadRoundedIcon />
                )
              }
              sx={{
                color: "#d81b60",
                borderColor: "rgba(240, 98, 146, 0.5)",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                px: 3,
              }}
            >
              {isSubiendoLogo
                ? "Subiendo..."
                : logoUrl
                  ? "Cambiar Logo"
                  : "Seleccionar Imagen"}
              <input
                type='file'
                hidden
                accept='image/*'
                onChange={handleLogoChange}
              />
            </Button>

            {logoUrl && (
              <Typography
                variant='caption'
                sx={{
                  color: "#2e7d32",
                  fontWeight: 700,
                  bgcolor: "rgba(46,125,50,0.06)",
                  px: 2,
                  py: 0.5,
                  borderRadius: "20px",
                }}
              >
                ✓ Logo cargado en el servidor con éxito
              </Typography>
            )}

            <Divider
              sx={{ width: "100%", borderColor: "rgba(0,0,0,0.05)", my: 1 }}
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant='h6'
                sx={{ fontWeight: 800, color: "#1a1a1a" }}
              >
                Dirección Geográfica
              </Typography>
              {/* Le pasamos el valor inicial recuperado de memoria si existe */}
              <LocationPicker
                initialValue={locationData}
                onLocationSelect={(data) => setLocationData(data)}
              />
              {locationData.address && (
                <Typography
                  variant='body2'
                  sx={{ color: "#d81b60", fontWeight: 600, mt: 1 }}
                >
                  📍 {locationData.address}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* PASO 1: STRIPE */}
        {activeStep === 1 && (
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
                <AccountBalanceIcon sx={{ fontSize: 50, color: "#f06292" }} />
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, color: "#1a1a1a" }}
                >
                  Pasarela de Pagos Stripe
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ maxWidth: 450 }}
                >
                  Vincula tu cuenta para automatizar las inscripciones y recibir
                  tus liquidaciones directo a tu banco.
                </Typography>
                <Button
                  variant='contained'
                  onClick={handleStripeConnect}
                  disabled={isConnecting}
                  disableElevation
                  sx={{
                    bgcolor: "#d81b60",
                    borderRadius: "10px",
                    px: 4,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1a1a1a" },
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
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, color: "#2e7d32" }}
                >
                  ¡Cuenta de Pagos Lista!
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Stripe Express se ha conectado de forma correcta a tu
                  academia.
                </Typography>
              </>
            )}
          </Box>
        )}

        {/* PASO 2: CONFIRMACIÓN */}
        {activeStep === 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 1,
              py: 3,
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 800, color: "#1a1a1a" }}>
              ¡Todo Listo para el Lanzamiento!
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ maxWidth: 400 }}
            >
              La identidad corporativa, coordenadas de mapas y cuenta bancaria
              se han unificado correctamente.
            </Typography>
          </Box>
        )}

        {/* BOTONES DE CONTROL */}
        <Box
          sx={{
            display: "flex",
            justifyMod: "flex-end",
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
              isSaving ||
              isSubiendoLogo ||
              (activeStep === 1 && !stripeConnected)
            }
            disableElevation
            sx={{
              bgcolor: "#d81b60",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
              "&:hover": { bgcolor: "#1a1a1a" },
            }}
          >
            {isSaving ? (
              <CircularProgress size={22} color='inherit' />
            ) : activeStep === steps.length - 1 ? (
              "Concluir Registro"
            ) : (
              "Continuar"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingStepper;
