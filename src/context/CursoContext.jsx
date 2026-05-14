import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "./AuthContext";

const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
  const { profile } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);

  const fetchCursos = useCallback(async () => {
    if (!profile?.school_id) return;

    setLoadingCursos(true);
    try {
      const { data, error } = await supabase
        .from("cursos")
        .select(
          `
          *,
          salon:salones(nombre) 
        `,
        ) // Traemos el nombre del salón asociado
        .eq("school_id", profile.school_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCursos(data || []);
    } catch (error) {
      console.error("Error cargando cursos:", error.message);
    } finally {
      setLoadingCursos(false);
    }
  }, [profile?.school_id]);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const value = {
    cursos,
    loadingCursos,
    refreshCursos: fetchCursos,
  };

  return (
    <CursoContext.Provider value={value}>{children}</CursoContext.Provider>
  );
};

export const useCursos = () => {
  const context = useContext(CursoContext);
  if (!context) {
    throw new Error("useCursos debe usarse dentro de un CursoProvider");
  }
  return context;
};
