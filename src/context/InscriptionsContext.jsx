import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../config/supabaseClient";

const InscriptionsContext = createContext();

export const InscriptionsProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Obtener todas las inscripciones del plantel (Para la tabla del Dashboard)
  const fetchEnrollments = useCallback(async (schoolId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
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
        students (
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
        )
        .eq("cursos.school_id", schoolId)
        .order("created_at", { ascending: false });

      if (err) throw err;

      // 🧮 Procesamos los datos en caliente para calcular el total real acumulado
      const enrrollmentsConSumaReal = (data || []).map((enrollment) => {
        // Sumamos todos los abonos extras detectados en la tabla payments
        const sumaAbonosExtras =
          enrollment.payments?.reduce(
            (acc, p) => acc + Number(p.amount || 0),
            0,
          ) || 0;

        // El total pagado real es: El apartado con el que nació + los abonos posteriores
        const totalPagadoReal = sumaAbonosExtras;

        return {
          ...enrollment,
          calculated_total_payment: totalPagadoReal, // ✨ Nueva propiedad calculada en vivo
          // Forzamos el estatus correcto visualmente si ya liquidó
          status:
            totalPagadoReal >= Number(enrollment.total_amount)
              ? "completed"
              : enrollment.status,
        };
      });

      setEnrollments(enrrollmentsConSumaReal);
    } catch (e) {
      console.error("Error en fetchEnrollments:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Función global para crear una Inscripción + su Primer Pago Manual
  // 2. Función global para crear una Inscripción + su Primer Pago Manual
  const createAdministrativeInscription = async (
    studentForm,
    courseData,
    paymentPayload,
  ) => {
    setError(null);
    try {
      // PASO 1: Directorio de estudiantes (Buscar o Registrar)
      let studentId;
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("phone", studentForm.phone)
        .maybeSingle();

      if (existingStudent) {
        studentId = existingStudent.id;
      } else {
        const { data: newStudent, error: studentErr } = await supabase
          .from("students")
          .insert({
            school_id: studentForm.school_id,
            name: studentForm.name,
            phone: studentForm.phone,
            email: studentForm.email || null,
          })
          .select()
          .single();

        if (studentErr) throw studentErr;
        studentId = newStudent.id;
      }

      // PASO 2: Crear inscripción con su VALOR INICIAL DE APARTADO
      const { data: newEnrollment, error: enrollErr } = await supabase
        .from("enrollments")
        .insert({
          course_id: courseData.course_id || courseData.id,
          student_id: studentId,
          total_amount: courseData.costo,
          payment_amount: Number(paymentPayload.amount), // Tu apartado inicial fijo 🔒
          status:
            Number(paymentPayload.amount) >= Number(courseData.costo)
              ? "completed"
              : "active",
        })
        .select()
        .single();

      if (enrollErr) throw enrollErr;

      // PASO 3: Guardar el recibo en la tabla de pagos para la auditoría de caja
      // 💡 NOTA: Para evitar que el Trigger altere este primer pago, podemos controlar
      // si el trigger se ejecuta o simplemente insertar el pago sabiendo que el acumulado ya es correcto.
      if (paymentPayload.amount > 0 && newEnrollment) {
        // Insertamos el recibo histórico. Como el trigger sumaría 400 + 400, para evitar el doble cobro
        // en la inscripción inicial, este insert específico se registra directo.

        const { error: payErr } = await supabase.from("payments").insert({
          enrollment_id: newEnrollment.id,
          amount: Number(paymentPayload.amount),
          payment_method: paymentPayload.payment_method,
          notes:
            paymentPayload.notes || "Inscripción inicial (Apartado en caja).",
        });

        // Si el trigger sumó doble por el insert del paso 3, lo arreglamos forzando el reset en caliente:
        if (!payErr) {
          await supabase
            .from("enrollments")
            .update({ payment_amount: Number(paymentPayload.amount) })
            .eq("id", newEnrollment.id);
        }
      }

      const targetSchoolId = studentForm.schoolId || courseData.schoolId;
      await fetchEnrollments(targetSchoolId);

      return { success: true };
    } catch (e) {
      console.error("Error en flujo de inscripción:", e.message);
      setError(e.message);
      return { success: false, error: e.message };
    }
  };
  // 3. Registrar abonos posteriores a una alumna (Liquidar saldos pendientes)
  const addNewPayment = async (enrollmentId, schoolId, paymentPayload) => {
    setLoading(true); // Encendemos el loading para bloquear clicks repetidos
    setError(null);

    try {
      // 1. Insertamos el abono ÚNICAMENTE en la tabla de pagos
      const { error: payErr } = await supabase.from("payments").insert({
        enrollment_id: enrollmentId,
        amount: Number(paymentPayload.amount),
        payment_method: paymentPayload.payment_method,
        notes: paymentPayload.notes || "Abono parcial en mostrador.",
      });

      if (payErr) throw payErr;

      // 2. ⏳ Pequeña pausa táctica de 150ms
      // Esto le da tiempo al servidor de Supabase de terminar la ejecución del Trigger AFTER INSERT
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 3. 🔄 Sincronización Real con el Servidor
      // En lugar de "adivinar" la matemática en React, mandamos a llamar a tu función fetchEnrollments
      // para que traiga el arreglo limpio con el 'total_payment' que el Trigger calculó.
      await fetchEnrollments(schoolId);

      return { success: true };
    } catch (e) {
      console.error("Error en el flujo de caja (React):", e.message);
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
        .order("created_at", { ascending: true }); // Orden cronológico

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
        fetchEnrollments,
        createAdministrativeInscription,
        addNewPayment,
        fetchPaymentHistory,
      }}
    >
      {children}
    </InscriptionsContext.Provider>
  );
};

// Hook personalizado para usarlo de forma express en tus componentes
export const useInscriptions = () => {
  const context = useContext(InscriptionsContext);
  if (!context) {
    throw new Error(
      "useInscriptions debe ser utilizado dentro de un InscriptionsProvider",
    );
  }
  return context;
};
