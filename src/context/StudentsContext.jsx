import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../config/supabaseClient";

const StudentsContext = createContext();

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  // 1. Cargar el catálogo completo de estudiantes de la academia
  const fetchStudents = useCallback(async (schoolId) => {
    if (!schoolId) return;
    setLoadingStudents(true);
    setStudentsError(null);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("id, name, phone, email, created_at")
        .eq("school_id", schoolId)
        .order("name", { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (e) {
      console.error("Error en fetchStudents:", e.message);
      setStudentsError(e.message);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  // 2. Registrar o actualizar una estudiante de forma directa (para un módulo de Directorio)
  const saveStudent = async (schoolId, studentData) => {
    setStudentsError(null);
    try {
      const { data, error } = await supabase
        .from("students")
        .upsert(
          {
            id: studentData.id || undefined, // Si lleva ID, Postgres actualiza; si no, inserta
            school_id: schoolId,
            name: studentData.name,
            phone: studentData.phone,
            email: studentData.email || null,
          },
          { onConflict: "phone" },
        ) // 🔒 Evita duplicados por número de WhatsApp
        .select()
        .single();

      if (error) throw error;

      // Refrescar la lista local en automático
      await fetchStudents(schoolId);
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
