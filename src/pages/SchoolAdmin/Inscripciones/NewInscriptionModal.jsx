import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Stack,
  Autocomplete,
} from "@mui/material";
import {
  Person as PersonIcon,
  WhatsApp as PhoneIcon,
  Email as EmailIcon,
  Class as CourseIcon,
  PointOfSale as PaymentIcon,
} from "@mui/icons-material";
import { supabase } from "../../../config/supabaseClient";
import { useCursos } from "../../../context/CursoContext";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { useInscriptions } from "../../../context/InscriptionsContext";
import { useStudents } from "../../../context/StudentsContext";

const NewInscriptionModal = ({ open, onClose, schoolId, onSaveSuccess }) => {
  // Estados de carga y catálogo
  const { createAdministrativeInscription } = useInscriptions();
  const { students, fetchStudents } = useStudents();
  const { cursos } = useCursos();
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isNewStudent, setIsNewStudent] = useState(true);
  // Campos del Formulario
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_id: "",
    student_id: null, // Para vincular con un estudiante existente si se encuentra por teléfono
    student_name: "",
    student_phone: "",
    student_email: "",
    payment_amount: 0,
    payment_method: "cash", // 'cash' o 'card_terminal'
    notes: "",
  });
  useEffect(() => {
    if (open && schoolId) {
      fetchStudents(schoolId);
    }
  }, [open, schoolId]);
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
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
      schoolId: schoolId,
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
      onClose(); // Se cierra de manera limpia y la tabla de fondo ya se actualizó sola.
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: "",
      student_name: "",
      student_phone: "",
      student_email: "",
      payment_amount: 0,
      payment_method: "cash",
      notes: "",
    });
    setSelectedCourse(null);
    setAvailability({ total_enrolled: 0, capacity: 0, slots_left: 0 });
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          pt: 3,
          bgcolor: "#F06292",
        }}
      >
        ✨ Registrar Nueva Inscripción Manual
      </DialogTitle>

      <Box component='form' onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ backgroundColor: "#FFF9FA" }}>
          {error && (
            <Alert severity='error' sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* SECCIÓN 1: Selección del Curso y Validación de Salón */}
            <Grid size={12}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
              >
                1. SELECCIÓN DE CURSO / MASTERCLASS
              </Typography>
              <TextField
                select
                fullWidth
                label='Seleccionar Curso Disponible'
                value={formData.course_id}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={loadingCourses}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <CourseIcon sx={{ color: "#f06292", mr: 1 }} />
                    ),
                  },
                }}
              >
                {loadingCourses ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  cursos.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <strong>{c.tipo_curso}</strong> - <em>{c.titulo}</em> — (
                      {FormatCurrency(c.costo)} MXN)
                    </MenuItem>
                  ))
                )}
              </TextField>

              {/* Banner Informativo del Cupo del Salón asignado */}
              {selectedCourse && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#fff",
                    borderRadius: "16px",
                    border: "1px solid rgba(240, 98, 146, 0.2)",
                  }}
                >
                  <Stack
                    direction='row'
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                    spacing={2}
                    useFlexGap
                  >
                    <Typography variant='body2' color='textSecondary'>
                      📍 Salón:{" "}
                      <strong>
                        {selectedCourse.salon?.nombre || "Sin asignar"}
                      </strong>
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      👥 Capacidad:{" "}
                      <strong>{availability.capacity} lugares</strong>
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 700,
                        color:
                          availability.slots_left <= 0
                            ? "error.main"
                            : "success.main",
                      }}
                    >
                      🎟️ Disponibles: {availability.slots_left} lugares
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* SECCIÓN 2: Datos del Alumno */}
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid size={12}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
              >
                2. DATOS DEL ESTUDIANTE
              </Typography>
            </Grid>

            {/* 🔍 BUSCADOR INTELIGENTE */}
            <Grid size={12}>
              <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.name} (${option.phone})`}
                onChange={(event, newValue) => {
                  if (newValue) {
                    // 🏢 Alumna Existente Seleccionada
                    setIsNewStudent(false);
                    setFormData({
                      id: newValue.id,
                      name: newValue.name,
                      phone: newValue.phone,
                      email: newValue.email || "",
                    });
                  } else {
                    // Si borran el buscador, se resetea a nueva alumna
                    setIsNewStudent(true);
                    setFormData({ id: null, name: "", phone: "", email: "" });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='🔍 Buscar Alumna (Nombre o Teléfono)'
                    variant='outlined'
                    helperText='Escribe para buscar. Si no aparece, llena los datos de abajo para registrarla como nueva.'
                  />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* CAMPO: NOMBRE */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Nombre de la Alumna'
                disabled={!isNewStudent} // 🔒 Bloqueado si ya existe
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>

            {/* CAMPO: TELÉFONO */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='WhatsApp / Teléfono'
                disabled={!isNewStudent} // 🔒 Bloqueado si ya existe
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Grid>

            {/* CAMPO: CORREO */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Correo Electrónico (Opcional)'
                disabled={!isNewStudent} // 🔒 Bloqueado si ya existe
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>

            {/* SECCIÓN 3: Gestión de Caja / Finanzas Manuales */}
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid size={12}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 700, mb: 1, color: "#2D2D2D" }}
              >
                3. REGISTRO DE PAGO EN CAJA RECEPCIÓN
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type='number'
                label='Monto Recibido en este acto'
                value={formData.payment_amount}
                onChange={(e) =>
                  setFormData({ ...formData, payment_amount: e.target.value })
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>$</InputAdornment>
                    ),
                    endAdornment: <PaymentIcon sx={{ color: "#f06292" }} />,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label='Método de Cobro Físico'
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({ ...formData, payment_method: e.target.value })
                }
              >
                <MenuItem value='cash'>💵 Efectivo (Caja Chica)</MenuItem>
                <MenuItem value='card_terminal'>
                  💳 Terminal Bancaria del Plantel
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Notas internas del cobro'
                placeholder='Ej. Liquidó en efectivo con billetes de $500, entregó comprobante...'
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: "#FFF9FA" }}>
          <Button onClick={handleClose} sx={{ color: "#777", fontWeight: 700 }}>
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
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {submitting ? "Inscribiendo..." : "Confirmar e Inscribir"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default NewInscriptionModal;
