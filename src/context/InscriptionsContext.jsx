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
        )
      `,
        )
        .eq("cursos.school_id", schoolId) // 🔒 Sigue filtrando de manera estricta por academia
        .order("created_at", { ascending: false });

      if (err) throw err;

      setEnrollments(data || []);
    } catch (e) {
      console.error("Error en fetchEnrollments:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
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
      // PASO 1: Buscar o Registrar a la estudiante en la agenda por su teléfono
      let studentId;

      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("phone", studentForm.phone)
        .maybeSingle();

      if (existingStudent) {
        studentId = existingStudent.id;
      } else {
        // Si es nueva, la creamos en la agenda express
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

      // PASO 2: Insertar la inscripción ligada al student_id
      // Inicializamos 'payment_amount' con el monto que va a dejar en caja de una vez
      const { data: newEnrollment, error: enrollErr } = await supabase
        .from("enrollments")
        .insert({
          course_id: courseData.course_id,
          student_id: studentId, // 👈 Identificador único de la alumna
          total_amount: courseData.costo,
          payment_amount: paymentPayload.amount, // Setear el abono inicial directo aquí elimina el bug del trigger
          status:
            paymentPayload.amount >= courseData.costo ? "completed" : "active",
        })
        .select()
        .single();

      if (enrollErr) throw enrollErr;

      // PASO 3: Registrar el recibo en la tabla de pagos para la auditoría de caja
      if (paymentPayload.amount > 0 && newEnrollment) {
        const { error: payErr } = await supabase.from("payments").insert({
          enrollment_id: newEnrollment.id,
          amount: paymentPayload.amount,
          payment_method: paymentPayload.payment_method,
          notes: paymentPayload.notes || "Inscripción inicial en mostrador.",
        });

        if (payErr) throw payErr;
      }

      await fetchEnrollments(courseData.schoolId);
      return { success: true };
    } catch (e) {
      console.error("Error en flujo de inscripción:", e.message);
      setError(e.message);
      return { success: false, error: e.message };
    }
  };

  // 3. Registrar abonos posteriores a una alumna (Liquidar saldos pendientes)
  const addNewPayment = async (enrollmentId, schoolId, paymentPayload) => {
    setError(null);
    try {
      // Intentamos insertar el pago. Si excede el monto, el Trigger de Supabase tirará un error inmediatamente
      const { error: payErr } = await supabase.from("payments").insert({
        enrollment_id: enrollmentId,
        ...paymentPayload,
      });

      // Si el Trigger rebotó el pago por exceso, aquí capturamos el mensaje exacto que escribimos en SQL
      if (payErr) {
        throw new Error(payErr.message);
      }

      // Si todo salió bien, el Trigger ya sumó el dinero y cambió el estatus en enrollments de fondo.
      // Solo nos queda refrescar el estado global de la UI:
      await fetchEnrollments(schoolId);
      return { success: true };
    } catch (e) {
      console.error("Error en pasarela/caja:", e.message);
      return { success: false, error: e.message }; // Este error lo pintas en tu Modal/Alerta de MUI
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
