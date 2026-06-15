import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../config/supabaseClient";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const { profile } = useAuth();
  const schoolId = profile?.school_id;

  // 💰 Estados Financieros
  const [cashboxSummary, setCashboxSummary] = useState({
    totalToday: 0,
    cashToday: 0,
    cardToday: 0,
    transferToday: 0,
    transactionCount: 0,
  });

  const [transactionsToday, setTransactionsToday] = useState([]); // ✨ NUEVO: Exclusivo para el día de hoy
  const [debtorsUrgent, setDebtorsUrgent] = useState([]); // ✨ NUEVO: Solo deudoras de cursos próximos (7 días)
  const [loadingFinance, setLoadingFinance] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 📊 Cargar Métricas y Reportes Financieros en Paralelo
   */
  const fetchFinanceData = useCallback(async () => {
    if (!schoolId) return;
    setLoadingFinance(true);
    setError(null);

    try {
      // ⏰ 1. CONTROL DE FECHAS EN TIEMPO REAL (Horario local de Toluca/CDMX)
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      const hoyLocalStr = new Date(Date.now() - tzOffset)
        .toISOString()
        .split("T")[0];

      // Rango estricto para pagos de HOY
      const inicioHoy = `${hoyLocalStr}T00:00:00.000Z`;
      const finHoy = `${hoyLocalStr}T23:59:59.999Z`;

      // Rango de 7 días hacia adelante para cursos próximos (Para alertas de cobranza)
      const fechaHoy = new Date(hoyLocalStr + "T00:00:00");
      const fechaLimite = new Date(hoyLocalStr + "T00:00:00");
      fechaLimite.setDate(fechaLimite.getDate() + 7); // +7 días naturales

      // 🚀 Consultas simultáneas optimizadas
      const [todayPaymentsRes, debtorsRes] = await Promise.all([
        // Query 1: Pagos estrictamente del día de HOY con data de la alumna y curso
        supabase
          .from("payments")
          .select(
            `
            id, created_at, amount, payment_method, notes,
            enrollments!inner(
              id,
              students(name, phone),
              cursos!inner(id, titulo, school_id)
            )
          `,
          )
          .eq("enrollments.cursos.school_id", schoolId)
          .gte("created_at", inicioHoy)
          .lte("created_at", finHoy)
          .order("created_at", { ascending: false }),

        // Query 2: Inscripciones activas con pagos para analizar la cartera vencida inminente
        supabase
          .from("enrollments")
          .select(
            `
            id, 
            total_amount, 
            status, 
            created_at,
            students (name, phone),
            cursos!inner (titulo, fecha_inicio, school_id),
            payments (amount) 
          `,
          )
          .eq("cursos.school_id", schoolId)
          .neq("status", "cancelled"),
      ]);

      // Validar respuestas de la base de datos
      if (todayPaymentsRes.error) throw todayPaymentsRes.error;
      if (debtorsRes.error) throw debtorsRes.error;

      // =========================================================================
      // 🧮 1. PROCESAR CORTE DE CAJA E INGRESOS EXCLUSIVOS DE HOY
      // =========================================================================
      const pagosHoyRaw = todayPaymentsRes.data || [];
      let totalToday = 0;
      let cashToday = 0;
      let cardToday = 0;
      let transferToday = 0;

      const ingresosProcesadosHoy = pagosHoyRaw.map((p) => {
        const monto = Number(p.amount || 0);

        // Acumuladores de KPIs
        totalToday += monto;
        if (p.payment_method === "cash") cashToday += monto;
        else if (
          p.payment_method === "card_terminal" ||
          p.payment_method === "card"
        )
          cardToday += monto;
        else if (p.payment_method === "stripe_online") transferToday += monto;

        return {
          id: p.id,
          date: p.created_at,
          amount: monto,
          method: p.payment_method,
          notes: p.notes || "Sin observaciones.",
          studentName: p.enrollments?.students?.name || "Alumna Registrada",
          studentPhone: p.enrollments?.students?.phone || "",
          courseTitle: p.enrollments?.cursos?.titulo || "Curso",
        };
      });

      setCashboxSummary({
        totalToday,
        cashToday,
        cardToday,
        transferToday,
        transactionCount: ingresosProcesadosHoy.length,
      });
      setTransactionsToday(ingresosProcesadosHoy);

      // =========================================================================
      // 🚨 2. FILTRAR CARTERA VENCIDA CRÍTICA (Próximos 7 días / Sin liquidar)
      // =========================================================================
      const deudorasFiltradas = (debtorsRes.data || [])
        .map((e) => {
          const totalCurso = Number(e.total_amount || 0);

          // Sumamos el historial de abonos de esta inscripción
          const totalPagado = (e.payments || []).reduce(
            (sum, p) => sum + Number(p.amount || 0),
            0,
          );

          const restante = totalCurso - totalPagado;

          return {
            enrollmentId: e.id,
            studentName: e.students?.name || "Alumna",
            studentPhone: e.students?.phone || "",
            courseTitle: e.cursos?.titulo || "Curso",
            fechaInicioCurso: e.cursos?.fecha_inicio, // Formato "YYYY-MM-DD"
            totalCourse: totalCurso,
            totalPaid: totalPagado,
            debt: restante,
          };
        })
        .filter((d) => {
          // 🛑 FILTRO 1: Descartamos por completo a las ya liquidadas (Deuda debe ser mayor a 0)
          if (d.debt <= 0) return false;

          // 🛑 FILTRO 2: El curso debe iniciar dentro de la ventana de los próximos 7 días
          if (!d.fechaInicioCurso) return false;
          const fechaCurso = new Date(d.fechaInicioCurso + "T00:00:00");

          // Valida si: fechaCurso >= Hoy Y fechaCurso <= Hoy + 7 días
          return fechaCurso >= fechaHoy && fechaCurso <= fechaLimite;
        })
        .sort((a, b) => b.debt - a.debt); // Ordenamos de mayor a menor urgencia de dinero

      setDebtorsUrgent(deudorasFiltradas);
    } catch (err) {
      console.error("Error crítico en el motor financiero:", err.message);
      setError(err.message);
    } finally {
      setLoadingFinance(false);
    }
  }, [schoolId]);

  return (
    <FinanceContext.Provider
      value={{
        cashboxSummary,
        transactions: transactionsToday, // ✨ Retorna estrictamente los movimientos de HOY
        debtors: debtorsUrgent, // ✨ Retorna estrictamente deudoras urgentes (rango 7 días)
        loadingFinance,
        error,
        refrescarFinanzas: fetchFinanceData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error(
      "useFinance debe ser utilizado dentro de un FinanceProvider",
    );
  }
  return context;
};
