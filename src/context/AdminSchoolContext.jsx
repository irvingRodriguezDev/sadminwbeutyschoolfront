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
      // ⏰ 1. CONTROL DE FECHA LOCAL (Evita desfases UTC de CDMX / Toluca)
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const hoyLocalISO = new Date(Date.now() - tzOffset)
        .toISOString()
        .split("T")[0];

      // 🚀 2. CONSULTAS EN PARALELO (Elimina el cuello de botella de esperas secuenciales)
      const [
        schoolRes,
        salonesRes,
        coursesRes,
        classesTodayRes,
        enrollmentsRes,
        totalStudentsCountRes,
      ] = await Promise.all([
        // Query 1: Datos de la academia
        supabase.from("schools").select("*").eq("id", schoolId).single(),

        // Query 2: Conteo de salones
        supabase
          .from("salones")
          .select("*", { count: "exact", head: true })
          .eq("school_id", schoolId),

        // Query 3: Catálogo de cursos activos
        supabase
          .from("cursos")
          .select("tipo_curso")
          .eq("school_id", schoolId)
          .eq("status", "active"),

        // Query 4: Cursos vigentes corriendo el día de hoy (Rango inclusivo)
        supabase
          .from("cursos")
          .select(
            `
          id, titulo, tipo_curso, hora_inicio, hora_fin, fecha_inicio, fecha_fin,
          salones (nombre)
        `,
          )
          .eq("school_id", schoolId)
          .lte("fecha_inicio", hoyLocalISO) // Ya empezó...
          .gte("fecha_fin", hoyLocalISO), // ...y no ha terminado

        // Query 5: Las últimas 5 inscripciones rápidas de la escuela (Ligero y con rango controlado)
        supabase
          .from("enrollments")
          .select(
            `
          id, created_at, status, total_amount,
          students (name),
          cursos!inner(id, titulo, school_id)
        `,
          )
          .eq("cursos.school_id", schoolId)
          .order("created_at", { ascending: false })
          .range(0, 4), // 🎯 Limitado desde la BD: Trae solo las 5 más nuevas

        // Query 6: Conteo real y absoluto de alumnas sin límite de registros (Evita el tope de 1,000)
        supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("school_id", schoolId),
      ]);

      // Validar errores críticos del set de consultas
      if (schoolRes.error) throw schoolRes.error;
      if (salonesRes.error) throw salonesRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (classesTodayRes.error) throw classesTodayRes.error;
      if (enrollmentsRes.error) throw enrollmentsRes.error;
      if (totalStudentsCountRes.error) throw totalStudentsCountRes.error;

      // 📝 3. PROCESAR METRICAS DE CURSOS
      const activeCoursesList = coursesRes.data || [];
      const cursosActivosCount = activeCoursesList.filter(
        (c) => c.tipo_curso === "Curso",
      ).length;
      const proximosTalleresCount = activeCoursesList.filter(
        (c) => c.tipo_curso === "Taller",
      ).length;

      // 📝 4. PROCESAR ACTIVIDADES DE HOY
      const actividadesProcesadas = (classesTodayRes.data || []).map(
        (item) => ({
          id: item.id,
          title: item.titulo || "Clase sin nombre",
          time: `${item.hora_inicio?.substring(0, 5) || "00:00"} - ${item.hora_fin?.substring(0, 5) || "00:00"}`,
          classroom: item.salones?.nombre || "Salón General",
          type: item.tipo_curso || "Curso",
          fecha_inicio: item.fecha_inicio,
          fecha_fin: item.fecha_fin,
        }),
      );

      // 📝 5. PROCESAR HISTORIAL DE INSCRIPCIONES RECIENTES
      const inscripcionesProcesadas = (enrollmentsRes.data || []).map((e) => {
        const studentName = e.students?.name || "Alumna Registrada";
        return {
          id: e.id,
          studentName: studentName.trim(),
          courseName: e.cursos?.titulo || "",
          status: e.status === "completed" ? "Pagado" : "abierto",
          initial: studentName ? studentName.charAt(0).toUpperCase() : "A",
        };
      });

      // 📝 6. ESTIMACIÓN DE OCUPACIÓN REAL DE INFRAESTRUCTURA
      const salonesCount = salonesRes.count || 0;
      const salonesOcupadosHoy = new Set(
        actividadesProcesadas.map((a) => a.classroom),
      ).size;
      const porcentajeOcupacion =
        salonesCount > 0
          ? Math.round((salonesOcupadosHoy / salonesCount) * 100)
          : 0;

      // 🌟 Actualización unificada del estado
      setSchoolData(schoolRes.data);
      setActividadesHoy(actividadesProcesadas);
      setUltimasInscripciones(inscripcionesProcesadas);
      setMetrics({
        salonesCount,
        cursosActivosCount,
        totalAlumnosCount: totalStudentsCountRes.count || 0, // Conteo exacto e ilimitado de alumnas
        proximosTalleresCount,
        ocupacionSalones: porcentajeOcupacion || 0,
      });
    } catch (err) {
      console.error("Error crítico en Dashboard Context:", err.message);
      setError(err.message);
    } finally {
      setLoadingDashboard(false);
    }
  }, [schoolId]);

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
        refrescarDashboard: fetchDashboardData,
      }}
    >
      {children}
    </AdminSchoolContext.Provider>
  );
};

export const useAdminSchool = () => {
  const context = useContext(AdminSchoolContext);
  if (!context) {
    throw new Error(
      "useAdminSchool debe ser utilizado dentro de un AdminSchoolProvider",
    );
  }
  return context;
};
