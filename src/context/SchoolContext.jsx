import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "./AuthContext";

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const { profile } = useAuth();
  const [school, setSchool] = useState(null);
  const [salones, setSalones] = useState([]);
  const [loadingSchool, setLoadingSchool] = useState(true);

  // Función para obtener los datos de la escuela y salones
  const fetchSchoolData = useCallback(async () => {
    if (!profile?.school_id) return;

    setLoadingSchool(true);
    try {
      // 1. Obtener datos de la escuela
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("id", profile.school_id)
        .maybeSingle();

      if (schoolError) throw schoolError;
      setSchool(schoolData);

      // 2. Obtener los salones asociados
      const { data: salonesData, error: salonesError } = await supabase
        .from("salones")
        .select("*")
        .eq("school_id", profile.school_id)
        .order("nombre", { ascending: true });

      if (salonesError) throw salonesError;
      setSalones(salonesData || []);
    } catch (error) {
      console.error("Error cargando el contexto de la escuela:", error.message);
    } finally {
      setLoadingSchool(false);
    }
  }, [profile?.school_id]);

  useEffect(() => {
    if (profile?.school_id) {
      fetchSchoolData();
    }
  }, [profile?.school_id, fetchSchoolData]);

  // Exponemos los datos y la función de refrescar (útil tras crear un salón)
  const value = {
    school,
    salones,
    loadingSchool,
    refreshSchoolData: fetchSchoolData,
  };

  return (
    <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool debe usarse dentro de un SchoolProvider");
  }
  return context;
};
