import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../config/supabaseClient";

const StudentsContext = createContext();

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // 🌸 Metadata global para el paginador de Material UI en el directorio
  const [studentsPagination, setStudentsPagination] = useState({
    totalPages: 1,
    totalRecords: 0,
  });

  // 1. Cargar estudiantes con tu patrón inteligente de parámetros 🚀
  const fetchStudents = useCallback(async (schoolId, params = {}) => {
    if (!schoolId) return { students: [], totalPages: 1, totalRecords: 0 };

    const {
      isSelect = false, // 🔒 Bandera clave para react-select
      page = 1,
      limit = 10,
      search = "",
    } = params;

    setLoadingStudents(true);
    setStudentsError(null);

    try {
      // Caso 1: Optimizado para react-select (Rápido, plano y sin paginar)
      if (isSelect) {
        const { data, error } = await supabase
          .from("students")
          .select("id, name, phone, email")
          .eq("school_id", schoolId)
          .order("name", { ascending: true });

        if (error) throw error;

        // Retornamos directo para no romper la vista de la tabla paginada
        return { students: data || [] };
      }

      // Caso 2: Modo Directorio / Tabla Administrativa (Con paginación y buscador)
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("students")
        .select("id, name, phone, email, created_at", { count: "exact" }) // { count: "exact" } para la UI
        .eq("school_id", schoolId);

      // 🔍 Buscador: Filtra si coincide el nombre O el teléfono (WhatsApp)
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, count, error } = await query
        .range(from, to)
        .order("name", { ascending: true });

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      // Guardamos en los estados globales para la tabla del Directorio
      setStudents(data || []);
      setStudentsPagination({
        totalPages: totalPages || 1,
        totalRecords: count || 0,
      });

      return {
        students: data || [],
        totalPages,
        totalRecords: count,
      };
    } catch (e) {
      console.error("Error en fetchStudents:", e.message);
      setStudentsError(e.message);
      return { students: [], totalPages: 1, totalRecords: 0 };
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  // 2. Registrar o actualizar una estudiante de forma directa
  const saveStudent = async (schoolId, studentData) => {
    setStudentsError(null);
    try {
      const { data, error } = await supabase
        .from("students")
        .upsert(
          {
            id: studentData.id || undefined,
            school_id: schoolId,
            name: studentData.name,
            phone: studentData.phone,
            email: studentData.email || null,
          },
          { onConflict: "phone" },
        )
        .select()
        .single();

      if (error) throw error;

      // 🔄 Refrescamos la primera página del directorio de inmediato de forma limpia
      await fetchStudents(schoolId, { page: 1, limit: 10 });
      return { success: true, data };
    } catch (e) {
      console.error("Error al guardar estudiante:", e.message);
      return { success: false, error: e.message };
    }
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        loadingStudents,
        studentsError,
        studentsPagination, // 🌸 Entregamos el control de páginas a la UI
        fetchStudents,
        saveStudent,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error(
      "useStudents debe ser utilizado dentro de un StudentsProvider",
    );
  }
  return context;
};
