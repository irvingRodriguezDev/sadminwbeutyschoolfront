import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../config/supabaseClient";

const InscriptionsContext = createContext();

export const InscriptionsProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // 🌸 Guardamos la metadata para pintar la paginación en la UI
  const [paginationData, setPaginationData] = useState({
    totalPages: 1,
    totalRecords: 0,
  });

  // 1. Obtener inscripciones con buscador y paginación unificada
  const fetchEnrollments = useCallback(async (schoolId, params = {}) => {
    if (!schoolId) return { enrollments: [], totalPages: 1, totalRecords: 0 };

    const { page = 1, limit = 10, search = "", isSelect = false } = params;

    setError(null);

    try {
      // 🌟 REFACTOR INTELIGENTE DE LOADERS:
      if (isSelect) {
        // En modo select no alteramos los cargadores globales de la interfaz
      } else if (search || page > 1) {
        // Si hay búsqueda o cambio de página, activamos el indicador sutil
        setIsFiltering(true);
      } else {
        // Si limpia el buscador o vuelve a la pág 1, solo mostramos pantalla completa
        // si el estado local realmente está vacío (carga inicial absoluta)
        setEnrollments((currentEnrollments) => {
          if (currentEnrollments.length === 0) {
            setLoading(true); // Levanta el LoadingScreen general
          }
          return currentEnrollments;
        });
        // Activamos también el filtro sutil para cambios rápidos de estado
        setIsFiltering(true);
      }

      // Si solo es para un selector rápido, traemos datos planos ultra ligeros
      if (isSelect) {
        const { data, error: err } = await supabase
          .from("enrollments")
          .select("id, status")
          .eq("cursos.school_id", schoolId)
          .order("created_at", { ascending: false });

        if (err) throw err;
        return { enrollments: data };
      }

      // Cálculo de rangos para Supabase PostgREST
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // 🚀 Query Base con el conteo exacto activado
      let query = supabase
        .from("enrollments")
        .select(
          `
          id, 
          created_at, 
          course_id, 
          student_id,
          status, 
          qr_code_token, 
          payment_amount, 
          total_amount, 
          students!inner (
            id,
            name, 
            phone, 
            email
          ),
          cursos!inner (
            id, 
            titulo, 
            costo, 
            school_id, 
            salones (
              nombre, 
              capacidad
            )
          ),
          payments (
            amount
          )
        `,
          { count: "exact" }, // 🎯 Indispensable para calcular páginas totales
        )
        .eq("cursos.school_id", schoolId);

      // 🔍 Buscador Inteligente: Filtra por nombre o teléfono de la alumna
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`, {
          foreignTable: "students",
        });
      }

      // Aplicamos rango de página y orden cronológico
      const {
        data,
        count,
        error: err,
      } = await query.range(from, to).order("created_at", { ascending: false });

      if (err) throw err;

      // 🧮 Tu matemática procesada en vivo
      const enrrollmentsConSumaReal = (data || []).map((enrollment) => {
        const sumaAbonosExtras =
          enrollment.payments?.reduce(
            (acc, p) => acc + Number(p.amount || 0),
            0,
          ) || 0;

        const totalPagadoReal = sumaAbonosExtras;

        return {
          ...enrollment,
          calculated_total_payment: totalPagadoReal,
          status:
            totalPagadoReal >= Number(enrollment.total_amount)
              ? "completed"
              : enrollment.status,
        };
      });

      const totalPages = Math.ceil((count || 0) / limit);

      // Actualizamos estados globales del contexto
      setEnrollments(enrrollmentsConSumaReal);
      setPaginationData({
        totalPages: totalPages || 1,
        totalRecords: count || 0,
      });

      return {
        enrollments: enrrollmentsConSumaReal,
        totalPages,
        totalRecords: count,
      };
    } catch (e) {
      console.error("Error en fetchEnrollments:", e.message);
      setError(e.message);
      return { enrollments: [], totalPages: 1, totalRecords: 0 };
    } finally {
      // 🔒 Saneamiento absoluto: Apagamos ambos cargadores al finalizar de forma segura
      setLoading(false);
      setIsFiltering(false);
    }
  }, []);

  // 2. Función global para crear una Inscripción + su Primer Pago Manual
  const createAdministrativeInscription = async (
    studentForm,
    courseData,
    paymentPayload,
  ) => {
    setError(null);
    try {
      const costoTotal = Number(courseData.costo);
      const abonoInicial = Number(paymentPayload.amount);

      // 1. Calculamos el saldo pendiente inicial
      const saldoRestante = costoTotal - abonoInicial;
      const esLiquidacionTotal = abonoInicial >= costoTotal;

      // 2. Si liquida de un solo golpe, generamos el token QR único de taquilla desde el inicio
      const statusPago = esLiquidacionTotal ? "completed" : "active";
      const tokenQR = esLiquidacionTotal
        ? `WBS-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
        : null;

      // 3. Crear inscripción con la estructura e importes reales calculados
      const { data: newEnrollment, error: enrollErr } = await supabase
        .from("enrollments")
        .insert({
          course_id: courseData.course_id || courseData.id,
          student_id: studentForm.studentId,
          total_amount: costoTotal, // Usando tus nombres estandarizados de columnas
          status: statusPago,
          qr_code_token: tokenQR, // 🔥 Sellado si pagó el 100% en un solo movimiento
          registration_source: "panel_admin",
          payment_amount: abonoInicial,
        })
        .select()
        .single();

      if (enrollErr) throw enrollErr;

      // 4. Guardar el recibo en la tabla de pagos para la auditoría de caja
      if (abonoInicial > 0 && newEnrollment) {
        const { error: payErr } = await supabase.from("payments").insert({
          enrollment_id: newEnrollment.id,
          amount: abonoInicial,
          payment_method: paymentPayload.payment_method,
          notes:
            paymentPayload.notes ||
            (esLiquidacionTotal
              ? "Inscripción inicial (Liquidación total en caja)."
              : "Inscripción inicial (Apartado parcial en caja)."),
        });

        if (payErr) {
          // Si por alguna razón falla el log de pagos, registramos el error pero no rompemos el flujo
          console.error(
            "Error al registrar auditoría de pago inicial:",
            payErr.message,
          );
        }
      }

      const targetSchoolId = studentForm.schoolId || courseData.schoolId;

      // 🔄 Refrescamos la primera página de la tabla de inmediato con los nuevos datos
      await fetchEnrollments(targetSchoolId, { page: 1, limit: 10 });

      return { success: true };
    } catch (e) {
      console.error("Error en flujo de inscripción administrativa:", e.message);
      setError(e.message);
      return { success: false, error: e.message };
    }
  };

  // 3. Registrar abonos posteriores a una alumna
  const addNewPayment = async (enrollmentId, schoolId, paymentPayload) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Insertar el nuevo abono en la tabla de pagos
      const { error: payErr } = await supabase.from("payments").insert({
        enrollment_id: enrollmentId,
        amount: Number(paymentPayload.amount),
        payment_method: paymentPayload.payment_method,
        notes: paymentPayload.notes || "Abono parcial en mostrador.",
      });

      if (payErr) throw payErr;

      // 2. Traer la inscripción actual con su costo total y sus pagos acumulados
      const { data: enrollment, error: fetchErr } = await supabase
        .from("enrollments")
        .select(
          `
          id,
          total_amount,
          payments (amount)
        `,
        )
        .eq("id", enrollmentId)
        .single();

      if (fetchErr) throw fetchErr;

      // 3. Calcular el total pagado sumando todos los abonos existentes
      const totalPagado = enrollment.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
      );
      const saldoPendiente = enrollment.total_amount - totalPagado;

      // 4. Si el saldo está liquidado (<= 0), disparamos la actualización del QR
      if (saldoPendiente === 0) {
        console.log(
          "🟢 ¡Entrando al bloque de liquidación! Generando Token...",
        );

        const secureToken = `WBS-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

        console.log("Datos a enviar a Supabase:", {
          status: "completed",
          qr_code_token: secureToken,
        });

        const { data: updateData, error: updateErr } = await supabase
          .from("enrollments")
          .update({
            status: "completed",
            qr_code_token: secureToken, // 🔥 Sellado inmutable
          })
          .eq("id", enrollmentId)
          .select(); // 👈 El .select() obliga a Supabase a retornar el registro modificado para corroborar
        console.log("====================================");
        console.log(updateData, "la data actualizada");
        console.log("====================================");
        // 🔥 OBLIGATORIO: Si Supabase rechaza la query, esto detendrá el flujo y mandará el error al catch
        if (updateErr) {
          console.error("❌ Supabase rechazó el UPDATE interno:", updateErr);
          throw new Error(
            `Error en Update: ${updateErr.message} - Detalle: ${updateErr.details}`,
          );
        }

        console.log("✅ Registro actualizado con éxito en la BD:", updateData);
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      // 🔄 Sincronización Real con los parámetros actuales
      await fetchEnrollments(schoolId, { page: 1, limit: 10 });

      return { success: true };
    } catch (e) {
      console.error(
        "🚨 Error completo detectado en el flujo de caja:",
        e.message,
      );
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (inscriptionId) => {
    try {
      const { data, error: err } = await supabase
        .from("payments")
        .select("*")
        .eq("enrollment_id", inscriptionId)
        .order("created_at", { ascending: true });

      if (err) throw err;
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <InscriptionsContext.Provider
      value={{
        enrollments,
        loading,
        error,
        paginationData, // 🌸 Exportamos la paginación de la tabla
        fetchEnrollments,
        createAdministrativeInscription,
        addNewPayment,
        fetchPaymentHistory,
        isFiltering,
      }}
    >
      {children}
    </InscriptionsContext.Provider>
  );
};

export const useInscriptions = () => {
  const context = useContext(InscriptionsContext);
  if (!context) {
    throw new Error(
      "useInscriptions debe ser utilizado dentro de un InscriptionsProvider",
    );
  }
  return context;
};
