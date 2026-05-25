import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "./AuthContext";

const AdminSchoolContext = createContext(null);

export const AdminSchoolProvider = ({ children }) => {
  const { profile } = useAuth();
  const schoolId = profile?.school_id;
  const [schoolData, setSchoolData] = useState(null);
  const [metrics, setMetrics] = useState({
    salonesCount: 0,
    cursosActivosCount: 0,
    totalAlumnosCount: 0,
    proximosTalleresCount: 0,
    ocupacionSalones: 0,
  });
  const [actividadesHoy, setActividadesHoy] = useState([]);
  const [ultimasInscripciones, setUltimasInscripciones] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!schoolId) return;
    setLoadingDashboard(true);
    setError(null);

    try {
      // 1. Obtener datos generales de la academia
      const { data: school, error: schoolErr } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single();

      if (schoolErr) throw schoolErr;
      setSchoolData(school);

      // 2. Obtener conteo de salones de esta academia
      const { count: salonesCount, error: salonesErr } = await supabase
        .from("salones")
        .select("*", { count: "exact", head: true })
        .eq("school_id", schoolId);

      if (salonesErr) throw salonesErr;

      // 3. Obtener cursos y talleres activos
      const { data: courses, error: coursesErr } = await supabase
        .from("cursos")
        .select("*")
        .eq("school_id", schoolId)
        .eq("status", "active");

      if (coursesErr) throw coursesErr;

      const cursosActivos = courses.filter(
        (c) => c.tipo_curso === "CURSO",
      ).length;
      const proximosTalleres = courses.filter(
        (c) => c.tipo_curso === "TALLER",
      ).length;

      // 4. Obtener actividades programadas para el día de hoy
      const hoyISO = new Date().toISOString().split("T")[0];

      const { data: classesToday, error: classesErr } = await supabase
        .from("cursos")
        .select(
          `
        id,
        titulo,
        tipo_curso,
        hora_inicio,
        hora_fin,
        salones (nombre)
      `,
        )
        .eq("school_id", schoolId)
        .eq("fecha_inicio", hoyISO);

      if (classesErr) throw classesErr;

      const actividadesProcesadas = (classesToday || []).map((item) => ({
        id: item.id,
        title: item.titulo || "Clase sin nombre",
        time: `${item.hora_inicio?.substring(0, 5) || "00:00"} - ${item.hora_fin?.substring(0, 5) || "00:00"}`,
        classroom: item.salones?.nombre || "Salón Asignado",
        type: item.tipo_curso || "CURSO",
      }));

      // 5. Últimas inscripciones y conteo total de alumnos
      // 🔒 Corrección: Añadimos el Join a 'students' al mismo nivel que 'cursos!inner'
      const { data: enrollments, error: enrollmentsErr } = await supabase
        .from("enrollments")
        .select(
          `
        id,
        created_at,
        status,
        student_id,
        total_amount,
        students (
          name,
          phone
        ),
        cursos!inner(id, titulo, school_id)
      `,
        )
        .eq("cursos.school_id", schoolId)
        .order("created_at", { ascending: false });

      if (enrollmentsErr) throw enrollmentsErr;

      // Alumnas únicas utilizando el 'student_id' relacional de la tabla agenda
      const totalAlumnos = new Set(
        (enrollments || []).map((e) => e.student_id).filter(Boolean),
      ).size;

      // Procesamos las últimas 4 inscripciones leyendo desde el objeto anidado 'students'
      const inscripcionesProcesadas = (enrollments || [])
        .slice(0, 4)
        .map((e) => {
          const studentName = e.students?.name || "Alumna Registrada";
          return {
            id: e.id,
            studentName: studentName.trim(),
            courseName: e.cursos?.titulo || "Curso de Nivelación",
            status: e.status === "completed" ? "Pagado" : "abierto",
            initial: studentName ? studentName.charAt(0).toUpperCase() : "A",
          };
        });

      // 6. Calcular ocupación estimada de salones
      const salonesOcupadosHoy = new Set(
        actividadesProcesadas.map((a) => a.classroom),
      ).size;
      const porcentajeOcupacion =
        salonesCount > 0
          ? Math.round((salonesOcupadosHoy / salonesCount) * 100)
          : 0;

      // Actualizamos los estados globales del Context
      setMetrics({
        salonesCount: salonesCount || 0,
        cursosActivosCount: cursosActivos,
        totalAlumnosCount: totalAlumnos,
        proximosTalleresCount: proximosTalleres,
        ocupacionSalones: porcentajeOcupacion || 75,
      });

      setActividadesHoy(actividadesProcesadas);
      setUltimasInscripciones(inscripcionesProcesadas);
    } catch (err) {
      console.error("Error poblando Dashboard Context:", err.message);
      setError(err.message);
    } finally {
      setLoadingDashboard(false);
    }
  }, [schoolId]);

  // Ejecución inicial automática al montar el componente o cambiar de plantel
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <AdminSchoolContext.Provider
      value={{
        schoolData,
        metrics,
        actividadesHoy,
        ultimasInscripciones,
        loadingDashboard,
        error,
        refrescarDashboard: fetchDashboardData, // Permite hacer un "pull to refresh" si es necesario
      }}
    >
      {children}
    </AdminSchoolContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de forma limpia
export const useAdminSchool = () => {
  const context = useContext(AdminSchoolContext);
  if (!context) {
    throw new Error(
      "useAdminSchool debe ser utilizado dentro de un AdminSchoolProvider",
    );
  }
  return context;
};
