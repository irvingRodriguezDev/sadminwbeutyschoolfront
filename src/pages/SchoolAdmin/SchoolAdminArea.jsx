import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import OnboardingStepper from "./OnBoardingStepper";
import SchoolAdminDashboard from "./SchoolAdminDashboard";
import LoadingScreen from "../../components/common/LoadingScreen";
import { Box, Typography } from "@mui/material";

const SchoolAdminArea = ({ userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [schoolData, setSchoolData] = useState(null);

  useEffect(() => {
    const checkSchoolStatus = async () => {
      try {
        const { data: school, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", userProfile.school_id)
          .maybeSingle();

        if (error) throw error;

        setSchoolData(school);

        if (school) {
          // 1. Verificación de Datos Básicos (Aplica para ambos tipos de escuela)
          const tieneDatosBasicos = Boolean(school.address && school.logo_url);

          let requiereCompletarOnboarding = false;

          // 2. Evaluación según el Modelo de Negocio
          if (school.is_franchise) {
            // Franquicia: Requiere datos básicos + Vincular cuenta de Stripe Connect
            const tieneStripeValido = Boolean(
              school.stripe_account_id && school.stripe_onboarding_complete,
            );
            requiereCompletarOnboarding =
              !tieneDatosBasicos || !tieneStripeValido;
          } else {
            // Sede Propia: Solo requiere datos básicos (se ignora Stripe)
            requiereCompletarOnboarding = !tieneDatosBasicos;
          }

          setNeedsOnboarding(requiereCompletarOnboarding);
          localStorage.setItem(
            "needsOnBoarding",
            requiereCompletarOnboarding ? "true" : "false",
          );
        }
      } catch (error) {
        console.error(
          "Error verificando estatus de la academia:",
          error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.school_id) {
      checkSchoolStatus();
    }
  }, [userProfile]);

  if (loading) {
    return <LoadingScreen message='Validando credenciales de la academia...' />;
  }

  return (
    <>
      {needsOnboarding ? (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
          <Typography
            variant='h4'
            sx={{ textAlign: "center" }}
            gutterBottom
            fontWeight='bold'
          >
            ¡Bienvenid@, {userProfile?.name?.split(" ")[0] || "Admin"}! 🌸
          </Typography>
          <Typography
            variant='body1'
            color='textSecondary'
            mb={4}
            sx={{ textAlign: "center" }}
          >
            Antes de comenzar, configuremos la información básica de tu escuela.
          </Typography>

          <OnboardingStepper
            schoolId={userProfile.school_id}
            schoolName={schoolData?.name}
            onComplete={() => {
              setNeedsOnboarding(false);
              localStorage.setItem("needsOnBoarding", "false");
            }}
          />
        </Box>
      ) : (
        <SchoolAdminDashboard schoolData={schoolData} />
      )}
    </>
  );
};

export default SchoolAdminArea;
