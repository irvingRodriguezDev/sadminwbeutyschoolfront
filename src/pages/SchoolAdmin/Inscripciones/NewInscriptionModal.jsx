import { useState } from "react";
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
import { supabase } from "../../../config/supabaseClient";
import { useCursos } from "../../../context/CursoContext";
import { useInscriptions } from "../../../context/InscriptionsContext";
import SelectCourse from "../../../components/common/inscriptions/NewInscriptions/SelectCourse";
import StudentData from "../../../components/common/inscriptions/NewInscriptions/StudentData";
import PaymentInformation from "../../../components/common/inscriptions/NewInscriptions/PaymentInformation";
import { useNavigate, useParams } from "react-router-dom";
import { alerts } from "../../../utils/alerts";

const NewInscription = ({}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { schoolId } = params;

  // Estados de carga y catálogo
  const { createAdministrativeInscription } = useInscriptions();
  const { cursos } = useCursos();
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isNewStudent, setIsNewStudent] = useState(true);
  // Campos del Formulario
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    student_id: studentId, // Para vincular con un estudiante existente si se encuentra por teléfono
    payment_amount: 0,
    payment_method: "cash", // 'cash' o 'card_terminal'
    notes: "",
  });

  // Estado de disponibilidad del salón
  const [availability, setAvailability] = useState({
    total_enrolled: 0,
    capacity: 0,
    slots_left: 0,
  });

  // 1. Cargar cursos activos de la escuela al abrir el modal

  // 2. Monitorear cupo y sugerir pago mínimo cuando cambia el curso seleccionado
  const handleCourseChange = async (courseId) => {
    const course = cursos.find((c) => c.id === courseId);
    setSelectedCourse(course);
    setError(null);

    if (!course) return;

    // Consultamos la capacidad y cuántos inscritos activos/completados hay actualmente
    try {
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

      // Sugerir el monto mínimo de apartado en el input
      const minPercentage = course.min_down_payment_percentage || 10;
      const minAmount = (course.costo * minPercentage) / 100;

      setFormData((prev) => ({
        ...prev,
        course_id: courseId,
        payment_amount: minAmount,
      }));
    } catch (e) {
      console.error("Error validando cupo:", e.message);
    }
  };

  // 3. Procesar el envío (Lógica de transacción manual)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let initialStatus = "pending_payment";
    const totalAmount = selectedCourse.costo;
    const paidAmount = Number(formData.payment_amount);

    if (paidAmount >= totalAmount) {
      initialStatus = "completed"; // Liquidado por completo
    } else if (paidAmount >= (totalAmount * 10) / 100) {
      initialStatus = "active"; // Cumple con el apartado mínimo
    }

    const studentData = {
      studentId: studentId,
    };
    const inscriptionPayload = {
      course_id: formData.course_id,
      status: initialStatus,
      total_amount: selectedCourse.costo,
      costo: selectedCourse.costo,
      payment_amount: formData.payment_amount,
      schoolId,
    };

    const paymentPayload = {
      amount: formData.payment_amount,
      payment_method: formData.payment_method,
      notes: formData.notes,
    };

    const result = await createAdministrativeInscription(
      studentData,
      inscriptionPayload,
      paymentPayload,
    );

    if (result.success) {
      alerts.success("La suscripcion se ha creado de manera exitosa");
      navigate(-1); // Se cierra de manera limpia y la tabla de fondo ya se actualizó sola.
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: "",
      student_id: null,
      payment_amount: 0,
      payment_method: "cash",
      notes: "",
    });
    setSelectedCourse(null);
    setAvailability({ total_enrolled: 0, capacity: 0, slots_left: 0 });
    setError(null);
    navigate(-1);
  };

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* 🌸 ENCABEZADO DE LA PÁGINA */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 900,
            color: "#E2208C",
            mb: 1,
          }}
        >
          ✨ Registrar Nueva Inscripción Manual
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          Completa los bloques informativos para dar de alta y procesar el pago
          de la alumna.
        </Typography>
      </Box>

      {/* 📄 CONTENEDOR PRINCIPAL DEL FORMULARIO */}
      <Paper
        component='form'
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          backgroundColor: "#FFF9FA",
          border: "1px solid #F9C4D9",
        }}
      >
        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* SECCIÓN 1: Selección del Curso y Validación de Salón */}
          <Grid size={12}>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mb: 1 }}
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
            <Divider sx={{ my: 1.5 }} />
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mb: 1 }}
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

          {/* SECCIÓN 3: Gestión de Caja / Finanzas Manuales */}
          <Grid size={12}>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 800, color: "#BE3C77", mb: 1 }}
            >
              3. Gestión de Caja y Finanzas
            </Typography>
          </Grid>

          <PaymentInformation formData={formData} setFormData={setFormData} />
        </Grid>

        {/* 🔘 BOTONERA DE ACCIÓN INFERIOR */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Stack
            direction='row'
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleClose}
              sx={{ color: "#777", fontWeight: 700, px: 3 }}
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
                borderRadius: "12px",
                px: 5,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(226, 32, 140, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(226, 32, 140, 0.4)",
                },
              }}
            >
              {submitting ? "Inscribiendo..." : "Confirmar e Inscribir"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewInscription;
