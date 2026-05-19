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
        .from("salones") // Asumiendo que tu tabla de salones se llama así
        .select("*", { count: "exact", head: true })
        .eq("school_id", schoolId);

      if (salonesErr) throw salonesErr;

      // 3. Obtener cursos y talleres activos
      // Aquí filtramos por tipo si los manejas en la misma tabla o traemos todos los de la escuela
      const { data: courses, error: coursesErr } = await supabase
        .from("cursos")
        .select("*")
        .eq("school_id", schoolId)
        .eq("status", "active"); // O la lógica que uses para determinar que están vigentes

      if (coursesErr) throw coursesErr;

      const cursosActivos = courses.filter((c) => c.type === "CURSO").length;
      const proximosTalleres = courses.filter(
        (c) => c.type === "TALLER",
      ).length;

      // 4. Obtener actividades programadas para el día de hoy
      const hoyInicio = new Date();
      hoyInicio.setHours(0, 0, 0, 0);
      const hoyFin = new Date();
      hoyFin.setHours(23, 59, 59, 999);

      const { data: classesToday, error: classesErr } = await supabase
        .from("schedules") // Tu tabla de horarios/clases del día
        .select(
          `
          id,
          start_time,
          end_time,
          salones (name),
          cursos (name, type)
        `,
        )
        .eq("school_id", schoolId)
        .gte("start_time", hoyInicio.toISOString())
        .lte("start_time", hoyFin.toISOString());

      if (classesErr) throw classesErr;

      // Formateamos las actividades de hoy para tu UI
      const actividadesProcesadas = (classesToday || []).map((item) => ({
        id: item.id,
        title: item.cursos?.name || "Clase sin nombre",
        time: `${new Date(item.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(item.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        classroom: item.salones?.name || "Salón Asignado",
        type: item.cursos?.type || "CURSO",
      }));

      // 5. Últimas inscripciones y conteo total de alumnos
      // Traemos las inscripciones uniendo la tabla intermedia con los datos de las alumnas (profiles/users)
      const { data: enrollments, error: enrollmentsErr } = await supabase
        .from("enrollments")
        .select(
          `
          id,
          created_at,
          status,
          payment_status,
          cursos (name),
          profiles (first_name, last_name)
        `,
        )
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (enrollmentsErr) throw enrollmentsErr;

      // Alumnas únicas inscritas
      const totalAlumnos = new Set(
        (enrollments || []).map((e) => e.profiles?.id),
      ).size;

      // Procesamos las últimas 4 inscripciones para la lista derecha del dashboard
      const inscripcionesProcesadas = (enrollments || [])
        .slice(0, 4)
        .map((e) => ({
          id: e.id,
          studentName:
            `${e.profiles?.first_name || ""} ${e.profiles?.last_name || ""}`.trim() ||
            "Alumna Registrada",
          courseName: e.cursos?.name || "Curso de Nivelación",
          status: e.payment_status === "paid" ? "Pagado" : "Pendiente",
          initial: e.profiles?.first_name
            ? e.profiles.first_name.charAt(0).toUpperCase()
            : "A",
        }));

      // 6. Calcular ocupación estimada de salones (Lógica de ejemplo basada en tu 75%)
      // Esto puede ser salones ocupados hoy / salones totales
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
        ocupacionSalones: porcentajeOcupacion || 75, // Fallback a tu diseño base si no hay clases
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
