import { createContext, useCallback, useContext, useState } from "react";
import { supabase } from "../config/supabaseClient";

const ReportsContext = createContext(null);

export const ReportsProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseReport, setSelectedCourseReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState(null);

  // 1. Obtener la lista de cursos para llenar el selector/dropdown de la interfaz
  const fetchCoursesList = useCallback(async (schoolId) => {
    setLoadingCourses(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("cursos")
        .select("id, titulo, maestro, fecha_inicio")
        .eq("school_id", schoolId)
        .order("titulo", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Error al obtener lista de cursos:", err.message);
      setError(err.message);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  // 2. Obtener y procesar la información del Reporte de Utilidad (Inscripciones, Pagos y Gastos)
  const fetchUtilityReport = useCallback(async (courseId) => {
    if (!courseId) return;

    setLoadingReport(true);
    setError(null);

    try {
      // A. Obtener inscripciones de este curso junto con sus abonos/pagos y la info del estudiante
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select(
          `
          id,
          students (
            name,
            email
          ),
          payments (
            id,
            notes,
            amount,
            payment_method,
            created_at
          )
        `,
        )
        .eq("course_id", courseId);

      if (enrollmentsError) throw enrollmentsError;

      // B. Obtener los gastos asociados a este curso específico que NO estén borrados lógicamente
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("id, title, amount, category, expense_date")
        .eq("course_id", courseId)
        .is("deleted_at", null)
        .order("expense_date", { ascending: false });

      if (expensesError) throw expensesError;

      // C. PROCESAR TODA LA INFORMACIÓN EN EL CLIENTE (Cero carga a Supabase)

      let totalIngresosBrutos = 0;
      const metodosPagoAgrupados = {
        efectivo: 0,
        transferencia: 0,
        stripe: 0,
        tarjeta: 0,
        otros: 0,
      };

      // Mapear y desglosar estudiantes con sus respectivos abonos
      const estudiantesProcesados = (enrollmentsData || []).map(
        (enrollment) => {
          const pagos = enrollment.payments || [];
          const totalEstudiante = pagos.reduce(
            (sum, pago) => sum + Number(pago.amount || 0),
            0,
          );

          // Sumar al acumulado general de ingresos
          totalIngresosBrutos += totalEstudiante;

          // Agrupar los pagos por método para la estadística financiera
          pagos.forEach((pago) => {
            // 1. Mapeo directo de Supabase (inglés) a las llaves del acumulador (español minúscula)
            let metodoNormalized = "otros";

            const dbMethod = String(pago.payment_method || "")
              .toLowerCase()
              .trim();

            if (dbMethod === "cash") metodoNormalized = "efectivo";
            else if (dbMethod === "stripe_online") metodoNormalized = "stripe";
            else if (dbMethod === "bank_transfer")
              metodoNormalized = "transferencia";
            else if (dbMethod === "card_terminal") metodoNormalized = "tarjeta";

            // 2. Sumamos de forma segura usando el valor correcto de la propiedad (amount)
            const montoPago = Number(pago.amount || 0);

            if (metodosPagoAgrupados.hasOwnProperty(metodoNormalized)) {
              metodosPagoAgrupados[metodoNormalized] += montoPago;
            } else {
              metodosPagoAgrupados.otros += montoPago;
            }
          });

          return {
            id: enrollment.id,
            estudiante: enrollment.students?.name || "Estudiante General",
            email: enrollment.students?.email || "",
            pagos: pagos.map((pago) => ({
              id: pago.id,
              concepto: pago.notes || "Abono",
              monto: Number(pago.amount || 0),
              metodo:
                pago.payment_method === "cash"
                  ? "Efectivo"
                  : pago.payment_method === "card_terminal"
                    ? "Tajeta"
                    : pago.payment_method === "stripe_online"
                      ? "Stripe"
                      : pago.payment_method === "bank_transfer"
                        ? "Transferencia"
                        : "Otro",
              fecha: pago.created_at,
            })),
            totalEstudiante,
          };
        },
      );

      // Calcular el total de gastos operativos de este curso
      const totalGastosCurso = (expensesData || []).reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0,
      );

      // Calcular Utilidad Neta final
      const utilidadNeta = totalIngresosBrutos - totalGastosCurso;

      // Guardar el consolidado en el estado del reporte
      setSelectedCourseReport({
        courseId,
        totalIngresos: totalIngresosBrutos,
        totalGastos: totalGastosCurso,
        utilidadNeta,
        metodosAgrupados: metodosPagoAgrupados,
        estudiantes: estudiantesProcesados,
        gastos: expensesData || [],
      });
    } catch (err) {
      console.error("Error al compilar el reporte de utilidad:", err.message);
      setError(err.message);
    } finally {
      setLoadingReport(false);
    }
  }, []);

  // 3. Limpiar reporte seleccionado
  const clearReport = useCallback(() => {
    setSelectedCourseReport(null);
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        courses,
        selectedCourseReport,
        loadingReport,
        loadingCourses,
        error,
        fetchCoursesList,
        fetchUtilityReport,
        clearReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports debe usarse dentro de un ReportsProvider");
  }
  return context;
};
