import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import OnboardingStepper from "./OnBoardingStepper";
import SchoolAdminDashboard from "./SchoolAdminDashboard"; // Tu vista principal
import LoadingScreen from "../../components/common/LoadingScreen";
import { Box, Typography } from "@mui/material";

const SchoolAdminArea = ({ userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [schoolData, setSchoolData] = useState(null);
  localStorage.setItem("needsOnBoarding", needsOnboarding);
  useEffect(() => {
    const checkSchoolStatus = async () => {
      try {
        // Consultamos la escuela asociada al perfil del usuario
        const { data: school, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", userProfile.school_id)
          .maybeSingle();

        if (error) throw error;

        setSchoolData(school);

        // Condición clave: Si no hay Stripe Key, necesita onboarding
        if (school.stripe_account_id && school.stripe_onboarding_complete) {
          setNeedsOnboarding(false);
          localStorage.setItem("needsOnBoarding", false);
        }
      } catch (error) {
        console.error("Error verificando estatus:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.school_id) {
      checkSchoolStatus();
    }
  }, [userProfile]);

  if (loading)
    return <LoadingScreen message='Validando credenciales de academia...' />;

  // Renderizado Condicional
  return (
    <>
      {needsOnboarding ? (
        <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
          <Typography
            variant='h4'
            sx={{
              textAlign: "center",
            }}
            gutterBottom
            fontWeight='bold'
          >
            ¡Bienvenid@, {userProfile.name}! 🌸
          </Typography>
          <Typography
            variant='body1'
            color='textSecondary'
            mb={4}
            sx={{
              textAlign: "center",
            }}
          >
            Antes de comenzar, configuremos lo básico de tu escuela.
          </Typography>

          <OnboardingStepper
            schoolId={userProfile.school_id}
            onComplete={() => setNeedsOnboarding(false)}
          />
        </Box>
      ) : (
        <SchoolAdminDashboard schoolData={schoolData} />
      )}
    </>
  );
};

export default SchoolAdminArea;
