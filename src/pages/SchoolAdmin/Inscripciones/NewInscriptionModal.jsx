import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Divider,
  Alert,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { useCursos } from "../../../context/CursoContext";
import { useInscriptions } from "../../../context/InscriptionsContext";
import SelectCourse from "../../../components/common/inscriptions/NewInscriptions/SelectCourse";
import StudentData from "../../../components/common/inscriptions/NewInscriptions/StudentData";
import PaymentInformation from "../../../components/common/inscriptions/NewInscriptions/PaymentInformation";
import { alerts } from "../../../utils/alerts";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const NewInscription = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  // 📥 Contextos del sistema
  const { createAdministrativeInscription } = useInscriptions();
  const { cursos } = useCursos();

  // ⚙️ Estados de control y carga
  const [loadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isNewStudent, setIsNewStudent] = useState(true);

  // 📝 Campos unificados del Formulario
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    student_id: null,
    payment_amount: 0,
    payment_method: "cash", // 'cash' o 'card_terminal'
    notes: "",
  });

  // 📊 Estado de disponibilidad real en salón
  const [availability, setAvailability] = useState({
    total_enrolled: 0,
    capacity: 0,
    slots_left: 0,
  });

  // 🔄 1. Monitorear cupos dinámicos y sugerir apartado mínimo al cambiar de curso
  const handleCourseChange = async (courseId) => {
    const course = cursos.find((c) => c.id === courseId);
    setSelectedCourse(course);
    setError(null);

    if (!course) return;

    try {
      // Consultamos el conteo real y exacto en Supabase de alumnos activos
      const { count, error: countErr } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId)
        .neq("status", "cancelled");

      if (countErr) throw countErr;

      const capacity = course.salon?.capacidad || 0;
      const slots_left = capacity - (count || 0);

      setAvailability({
        total_enrolled: count || 0,
        capacity,
        slots_left,
      });

      // 🧮 Sugerir el porcentaje mínimo configurado en la base de datos (default 10%)
      const minPercentage = course.min_down_payment_percentage || 10;
      const minAmount = (course.costo * minPercentage) / 100;

      setFormData((prev) => ({
        ...prev,
        course_id: courseId,
        payment_amount: minAmount,
      }));
    } catch (e) {
      console.error("Error validando cupo:", e.message);
      setError("No se pudo verificar la disponibilidad del salón.");
    }
  };

  // 🚀 2. Procesar el envío de la Inscripción
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛑 VALIDACIÓN DE SEGURIDAD 1: Que exista un curso seleccionado
    if (!selectedCourse) {
      alerts.error(
        "Falta información",
        "Por favor, selecciona un curso antes de continuar.",
      );
      return;
    }

    // 🛑 VALIDACIÓN DE SEGURIDAD 2: Que no supere el costo total
    const totalAmount = Number(selectedCourse.costo || 0);
    const paidAmount = Number(formData.payment_amount || 0);

    if (paidAmount > totalAmount) {
      alerts.error(
        "Monto Inválido",
        `El monto abonado no puede ser mayor al costo total del curso (${FormatCurrency(totalAmount)}).`,
      );
      return; // ✅ Corregido: Rompe la ejecución para evitar enviar basura al backend
    }

    // 🚦 Determinación del estatus inicial según las reglas de negocio
    let initialStatus = "pending_payment";
    const minRequired = (totalAmount * 10) / 100; // 10% mínimo reglamentario

    if (paidAmount >= totalAmount) {
      initialStatus = "completed"; // Liquidado al 100%
    } else if (paidAmount >= minRequired) {
      initialStatus = "active"; // Cumple con el enganche para considerarse apartado
    }

    // 🔒 Encendemos loader para evitar clicks fantasmas/duplicados
    setSubmitting(true);

    const studentData = { studentId };

    const inscriptionPayload = {
      course_id: formData.course_id,
      status: initialStatus,
      total_amount: totalAmount,
      costo: totalAmount,
      payment_amount: paidAmount,
      schoolId,
    };

    const paymentPayload = {
      amount: paidAmount,
      payment_method: formData.payment_method,
      notes: formData.notes,
    };

    try {
      const result = await createAdministrativeInscription(
        studentData,
        inscriptionPayload,
        paymentPayload,
      );

      if (result.success) {
        alerts.success(
          "¡Excelente!",
          "La inscripción se ha registrado de manera exitosa.",
        );
        navigate(-1); // Regresa de manera fluida actualizando la tabla
      } else {
        setError(
          result.error || "Ocurrió un error al procesar la inscripción.",
        );
      }
    } catch (err) {
      console.error("Error en Submit:", err);
      setError("Error crítico de red al registrar la inscripción.");
    } finally {
      setSubmitting(false); // ✅ Saneamiento: Apagamos loader siempre
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* 🌸 ENCABEZADO PREMIUM DE LA PÁGINA */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            background: "linear-gradient(90deg, #E2208C 0%, #BE3C77 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Registrar Inscripción Manual
        </Typography>
        <Typography
          variant='body1'
          sx={{ color: "#745E67", fontSize: "0.95rem" }}
        >
          Ingresa los datos para matricular y procesar el cobro en mostrador de
          forma centralizada.
        </Typography>
      </Box>

      {/* 📄 CONTENEDOR TIPO GLASSMORPHISM SUAVE */}
      <Paper
        component='form'
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          backgroundColor: "#fff",
          border: "1px solid rgba(249, 196, 217, 0.4)",
          boxShadow: "0px 15px 45px rgba(226, 32, 140, 0.03)",
        }}
      >
        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* SECCIÓN 1: Selección del Curso */}
          <Grid size={12}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mb: 0.5 }}
            >
              1. Selección de Curso y Horarios
            </Typography>
          </Grid>

          <SelectCourse
            handleCourseChange={handleCourseChange}
            formData={formData}
            loadingCourses={loadingCourses}
            setSelectedCourse={setSelectedCourse}
            cursos={cursos}
            selectedCourse={selectedCourse}
            availability={availability}
          />

          {/* SECCIÓN 2: Datos del Alumno */}
          <Grid size={12}>
            <Divider sx={{ my: 1, borderColor: "rgba(240, 98, 146, 0.1)" }} />
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mt: 1, mb: 0.5 }}
            >
              2. Información de la Alumna
            </Typography>
          </Grid>

          <StudentData
            formData={formData}
            setFormData={setFormData}
            isNewStudent={isNewStudent}
            setIsNewStudent={setIsNewStudent}
            schoolId={schoolId}
            setStudentId={setStudentId}
          />

          {/* SECCIÓN 3: Gestión de Caja */}
          <Grid size={12}>
            <Divider sx={{ my: 1, borderColor: "rgba(240, 98, 146, 0.1)" }} />
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mt: 1, mb: 0.5 }}
            >
              3. Gestión de Caja y Finanzas
            </Typography>
          </Grid>

          <PaymentInformation formData={formData} setFormData={setFormData} />
        </Grid>

        {/* 🔘 BOTONERA DE ACCIÓN INFERIOR */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3, borderColor: "rgba(240, 98, 146, 0.1)" }} />
          <Stack
            direction='row'
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleClose}
              disabled={submitting}
              sx={{
                color: "#745E67",
                fontWeight: 700,
                px: 3,
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={
                submitting || (selectedCourse && availability.slots_left <= 0)
              }
              sx={{
                background: "linear-gradient(90deg, #E2208C 0%, #F06292 100%)",
                borderRadius: "14px",
                px: 5,
                py: 1.6,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow: "0 4px 14px rgba(226, 32, 140, 0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #BE3C77 0%, #E2208C 100%)",
                  boxShadow: "0 6px 20px rgba(226, 32, 140, 0.35)",
                },
              }}
            >
              {submitting ? "Procesando Alta..." : "Confirmar e Inscribir"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewInscription;
