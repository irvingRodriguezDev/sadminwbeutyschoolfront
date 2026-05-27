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

  // 🚀 CONSEJO PRO: Envolvemos con useCallback con dependencia vacía [] para que NUNCA cambie su referencia en memoria
  const fetchSchoolData = useCallback(async (schoolId) => {
    const targetId = schoolId || profile?.school_id;
    if (!targetId) return;

    setLoadingSchool(true);
    try {
      // ⚡ OPTIMIZACIÓN: Disparamos ambas consultas en paralelo para que vuelen en la pestaña Network
      const [schoolResponse, salonesResponse] = await Promise.all([
        supabase.from("schools").select("*").eq("id", targetId).maybeSingle(),
        supabase
          .from("salones")
          .select("*")
          .eq("school_id", targetId)
          .order("nombre", { ascending: true }),
      ]);

      if (schoolResponse.error) throw schoolResponse.error;
      if (salonesResponse.error) throw salonesResponse.error;

      setSchool(schoolResponse.data);
      setSalones(salonesResponse.data || []);
    } catch (error) {
      console.error("Error cargando el contexto de la escuela:", error.message);
    } finally {
      setLoadingSchool(false);
    }
  }, []); // Dejamos esto vacío para asegurar estabilidad total de la función

  // 🔄 Control estricto de la carga inicial automática
  useEffect(() => {
    if (profile?.school_id) {
      // 🚀 Se dispara ÚNICAMENTE cuando cambia el ID real de la escuela, rompiendo las 175 peticiones
      fetchSchoolData(profile.school_id);
    } else {
      // 🧼 Limpieza preventiva si el usuario cierra sesión
      setSchool(null);
      setSalones([]);
      setLoadingSchool(false);
    }
  }, [profile?.school_id]); // ⚡ Retiramos fetchSchoolData de aquí para blindar el bucle infinito

  // Exponemos los datos y la función de refrescar de manera intuitiva
  const value = {
    school,
    salones,
    loadingSchool,
    refreshSchoolData: () => fetchSchoolData(profile?.school_id),
  };

  return (
    <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("useSchool debe usarse dentro de un SchoolProvider");
  }
  return context;
};
