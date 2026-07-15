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
  const [isFiltering, setIsFiltering] = useState(false);
  // 📑 Guardamos estados para la paginación y el control administrativo global
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    totalRecords: 0,
  });

  // 🚀 CONSEJO PRO: Envolvemos en useCallback para evitar bucles infinitos en el useEffect
  const fetchCursos = useCallback(async (schoolId, params = {}) => {
    if (!schoolId) return { courses: [], totalPages: 1, totalRecords: 0 };

    const { isSelect = false, page = 1, limit = 10, search = "" } = params;

    try {
      // 🌟 REFACTOR INTELIGENTE DE LOADERS:
      if (isSelect) {
        // Si es para el react-select, no movemos ningún loader global de la interfaz
      } else if (search || page > 1) {
        // Si está buscando o cambió de página, usamos la carga sutil de barra/opacidad
        setIsFiltering(true);
      } else {
        // Si page es 1 y search está vacío, SOLO encendemos la pantalla completa si es la primera vez (catálogo vacío)
        // Usamos una función de actualización de estado basada en el valor anterior para evitar closures inestables
        setCursos((currentCursos) => {
          if (currentCursos.length === 0) {
            setLoadingCursos(true);
          }
          return currentCursos;
        });
        // También encendemos el loader de filtrado sutil para cuando se limpia el input
        setIsFiltering(true);
      }

      // Caso 1: Optimizado para react-select (Rápido y ligero)
      if (isSelect) {
        const { data, error } = await supabase
          .from("cursos")
          .select(
            `
      id, 
      titulo, 
      costo, 
      fecha_inicio,
      fecha_fin,
      tipo_curso,
      salon:salones(capacidad),
      enrollments(id) 
    `,
          ) // 👈 Agregamos la metadata indispensable para el Select inteligente
          .eq("school_id", schoolId)
          .neq("enrollments.status", "cancelled") // Filtra inscripciones canceladas de una vez
          .order("titulo", { ascending: true });

        if (error) throw error;
        return { courses: data };
      }

      // Caso 2: Modo Lista / Tabla Administrativa (Con paginación y buscador)
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("cursos")
        .select(
          `id, titulo, tipo_curso, flayer_url, maestro, costo, fecha_inicio, fecha_fin, descripcion, lista_materiales, hora_inicio, hora_fin, temario, plan_pagos,
           salon:salones(id, nombre, capacidad)`,
          { count: "exact" },
        )
        .eq("school_id", schoolId);

      if (search) {
        query = query.ilike("titulo", `%${search}%`);
      }

      const { data, count, error } = await query
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      // Guardamos los datos en el estado global
      setCursos(data || []);
      setPaginationData({
        totalPages: totalPages || 1,
        totalRecords: count || 0,
      });

      return {
        courses: data,
        totalPages,
        totalRecords: count,
      };
    } catch (error) {
      console.error("Error en fetchCursos:", error.message);
      return { courses: [], totalPages: 1, totalRecords: 0 };
    } finally {
      // 🔒 Blindaje: Apagamos los cargadores de forma segura siempre
      setLoadingCursos(false);
      setIsFiltering(false);
    }
  }, []);

  // 🔄 Carga automática inicial del catálogo completo solo cuando el administrador se loguea
  useEffect(() => {
    if (profile?.school_id) {
      // Por defecto carga la primera página del listado normal de la escuela
      fetchCursos(profile.school_id, { page: 1, limit: 10 });
    }
  }, [profile?.school_id, fetchCursos]);

  const value = {
    cursos,
    loadingCursos,
    paginationData, // Entregamos la metadata a la UI para pintar el <Pagination /> de MUI
    fetchCursos, // Cambiado de refreshCursos a fetchCursos para mantener el nombre intuitivo
    isFiltering,
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
