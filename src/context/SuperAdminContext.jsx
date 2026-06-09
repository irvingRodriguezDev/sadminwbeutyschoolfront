import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../config/supabaseClient";

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalEscuelas: 0,
    totalUsuarios: 0,
    totalCursos: 0,
    crecimientoEscuelas: 0,
  });
  const [escuelas_activas, setEscuelasActivas] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Conteo de Escuelas (Instituciones)
      const { count: escuelasCount } = await supabase
        .from("schools")
        .select("*", { count: "exact", head: true });

      // 2. Conteo de Usuarios Totales (Perfiles)
      const { count: usuariosCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // 3. Conteo de Cursos Globales (Actividad técnica)
      const { count: cursosCount } = await supabase
        .from("cursos")
        .select("*", { count: "exact", head: true });

      // 4. Obtener últimas 5 escuelas registradas para el panel lateral
      const { data: recientes } = await supabase
        .from("schools")
        .select("name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalEscuelas: escuelasCount || 0,
        totalUsuarios: usuariosCount || 0,
        totalCursos: cursosCount || 0,
        crecimientoEscuelas: 15, // Esto podría calcularse comparando con el mes anterior
      });

      setUltimosRegistros(recientes || []);
      // 1. Obtenemos todas las escuelas con su fecha de creación
      const { data: escuelas, error } = await supabase
        .from("schools")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) throw error;
      // 2. Mapeo de nombres de meses en español
      const mesesNombres = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      // 3. Agrupar por mes
      const conteoPorMes = escuelas.reduce((acc, curr) => {
        const fecha = new Date(curr.created_at);
        const mesNombre = mesesNombres[fecha.getMonth()];

        if (!acc[mesNombre]) {
          acc[mesNombre] = 0;
        }
        acc[mesNombre] += 1;
        return acc;
      }, {});

      // 4. Transformar al formato de la gráfica (dataPrueba)
      const dataGrafica = Object.keys(conteoPorMes).map((mes) => ({
        name: mes,
        escuelas: conteoPorMes[mes],
      }));

      // Guardar en un nuevo estado (ej. )
      setChartData(dataGrafica);

      // Hoy es 2026-06-09
      const hoyISO = new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Mexico_City",
      });

      // Calcular fecha límite de hace 20 días
      const fechaHace20Dias = new Date();
      fechaHace20Dias.setDate(fechaHace20Dias.getDate() - 20);
      const hace20DiasISOString = fechaHace20Dias.toLocaleDateString("sv-SE", {
        timeZone: "America/Mexico_City",
      });

      const { data: escuelasData, errorEscuelasActivas } = await supabase
        .from("schools")
        .select(
          `
          *, 
          perfil:profiles(id, email, rol), 
          total_estudiantes:students(count),
          cursos:cursos(
            id,
            status,
            fecha_inicio,
            enrollments:enrollments(
              student_id,
              payments:payments(id, amount, created_at)
            )
          )
        `,
        )
        .order("name", { ascending: true });

      if (errorEscuelasActivas) throw errorEscuelasActivas;

      const escuelasFormateadas = (escuelasData || []).map((escuela) => {
        // Aplanar perfil
        const perfilFormateado = Array.isArray(escuela.perfil)
          ? escuela.perfil[0] || null
          : escuela.perfil;

        // Extraer total de estudiantes desde el conteo directo
        const totalEstudiantes = Array.isArray(escuela.total_estudiantes)
          ? escuela.total_estudiantes[0]?.count || 0
          : escuela.total_estudiantes?.count || 0;

        let totalCursosActivosFuturos = 0;
        let ingresosUltimos20Dias = 0;

        if (Array.isArray(escuela.cursos)) {
          escuela.cursos.forEach((curso) => {
            // 🌟 Conteo estricto de cursos vigentes (status active y fecha >= hoy)
            if (curso.status === "active" && curso.fecha_inicio) {
              if (curso.fecha_inicio >= hoyISO) {
                totalCursosActivosFuturos++;
              }
            }

            // Procesar pagos si el RLS ya permite ver los enrollments
            if (Array.isArray(curso.enrollments)) {
              curso.enrollments.forEach((inscripcion) => {
                const pagos = inscripcion.payments;
                if (pagos) {
                  const listaPagos = Array.isArray(pagos) ? pagos : [pagos];
                  listaPagos.forEach((pago) => {
                    if (pago.created_at) {
                      const fechaPagoISO = pago.created_at.substring(0, 10);
                      if (fechaPagoISO >= hace20DiasISOString) {
                        ingresosUltimos20Dias += pago.amount || 0;
                      }
                    }
                  });
                }
              });
            }
          });
        }

        return {
          ...escuela,
          perfil: perfilFormateado,
          total_cursos: totalCursosActivosFuturos,
          total_estudiantes: totalEstudiantes,
          ingresos_20_dias: ingresosUltimos20Dias,
        };
      });

      setEscuelasActivas(escuelasFormateadas);
    } catch (error) {
      console.error("Error en SuperAdminContext:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <SuperAdminContext.Provider
      value={{
        stats,
        ultimosRegistros,
        loading,
        chartData,
        escuelas_activas,
        refreshGlobal: fetchGlobalData,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => useContext(SuperAdminContext);
