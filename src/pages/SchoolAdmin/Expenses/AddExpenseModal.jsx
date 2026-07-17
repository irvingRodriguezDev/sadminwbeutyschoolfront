import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Close,
  CloudUpload,
  ReceiptLong,
  CheckCircle,
} from "@mui/icons-material";
import { supabase } from "../../../config/supabaseClient";
import { alerts } from "../../../utils/alerts";
import { useExpenses } from "../../../context/ExpensesContext";

const CATEGORIES = [
  "Materiales",
  "Sueldos",
  "Publicidad",
  "Servicios",
  "Renta",
  "Otros",
];

const AddExpenseModal = ({ open, onClose, schoolId, onExpenseAdded }) => {
  const { fetchCourses, courses, loadingCourses } = useExpenses();
  const [isSaving, setIsSaving] = useState(false);
  // Estados del Formulario
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [courseId, setCourseId] = useState(""); // Puede quedar vacío (gasto general)
  const [description, setDescription] = useState("");
  // Estados del Comprobante (Opcional)
  const [file, setFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileNamePreview, setFileNamePreview] = useState("");
  // Cargar cursos de la escuela para el selector dinámico
  useEffect(() => {
    fetchCourses(schoolId);
  }, [open, schoolId]);
  // Manejador de selección de archivo (Comprobante)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileNamePreview(selectedFile.name);
    }
  };
  // Función interna para subir el archivo al Bucket "expense-receipts" de Supabase
  const uploadReceipt = async () => {
    if (!file) return null;
    try {
      setUploadingFile(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `receipt-${Date.now()}.${fileExt}`;
      const filePath = `${schoolId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("expense-receipts") // Asegúrate de crear este bucket público o privado en Supabase Storage
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenemos la URL pública del archivo
      const {
        data: { publicUrl },
      } = supabase.storage.from("expense-receipts").getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error("Error al subir comprobante:", err);
      alerts.error(
        "Subida Fallida",
        "No se pudo cargar el archivo del ticket.",
      );
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !expenseDate) {
      alerts.error(
        "Campos requeridos",
        "Por favor completa toda la información principal.",
      );
      return;
    }

    setIsSaving(true);
    try {
      // 1. Subir ticket de forma opcional
      let receiptUrl = null;
      if (file) {
        receiptUrl = await uploadReceipt();
      }

      // 2. Insertar el gasto en la Base de Datos
      const newExpense = {
        school_id: schoolId,
        title,
        amount: parseFloat(amount),
        category,
        expense_date: expenseDate,
        course_id: courseId !== "" ? courseId : null, // Si no se selecciona, se guarda como NULL
        description: description || null,
        receipt_url: receiptUrl,
        created_at: new Date(),
      };

      const { error } = await supabase.from("expenses").insert([newExpense]);

      if (error) throw error;

      alerts.success("¡Hecho!", "El gasto se ha registrado correctamente.");

      // Limpiar estados e informar al padre
      handleResetForm();
      if (onExpenseAdded) onExpenseAdded();
      onClose();
    } catch (err) {
      console.error("Error guardando gasto:", err);
      alerts.error("Error", "No se pudo registrar el gasto en este momento.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setCourseId("");
    setDescription("");
    setFile(null);
    setFileNamePreview("");
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? null : onClose} // Evita cerrar el modal a la mitad de una transacción
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px", // Esquinas suavizadas ultra-premium
          p: 2,
          boxShadow: "0px 24px 50px rgba(240, 98, 146, 0.12)",
        },
      }}
    >
      {/* CABECERA */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ReceiptLong sx={{ color: "#E53888", fontSize: 28 }} />
          <Typography
            variant='h5'
            fontWeight={800}
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#2A2628",
            }}
          >
            Registrar Gasto
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={isSaving}
          sx={{ color: "#6B6567" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 2 }}>
          <Grid container spacing={2.5}>
            {/* Concepto / Título */}
            <Grid size={12}>
              <TextField
                fullWidth
                required
                autoComplete='off'
                label='Concepto del Gasto'
                placeholder='Ej: Kit de acrílicos Wapizima, Pago de luz...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Monto */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type='number'
                autoComplete='off'
                label='Monto ($)'
                placeholder='0.00'
                slotProps={{ htmlInput: { step: "any", min: "0" } }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Fecha de Gasto */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type='date'
                label='Fecha'
                autoComplete='off'
                slotProps={{ shrink: true }}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Categoría */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                required
                label='Categoría'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Curso Asociado (Opcional pero estratégico!) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label='Asociar a Curso'
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={loadingCourses}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <MenuItem value=''>
                  <em>Ninguno (Gasto General)</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.titulo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Descripción */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                autoComplete='off'
                rows={2}
                label='Detalles adicionales (Opcional)'
                placeholder='Escribe notas relevantes aquí...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* SUBIDA DE ARCHIVO CUTE & PREMIUM */}
            <Grid size={12}>
              <Grid container spacing={2}>
                <Grid
                  size={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: 600, color: "#554D4F", mb: 1 }}
                  >
                    Comprobante / Ticket (Opcional)
                  </Typography>
                </Grid>

                <Grid
                  size={12}
                  sx={{
                    border: "2px dashed rgba(240, 98, 146, 0.3)",
                    borderRadius: "16px",
                    p: 3,
                    textAlign: "center",
                    backgroundColor: file
                      ? "rgba(16, 185, 129, 0.04)"
                      : "rgba(240, 98, 146, 0.02)",
                    borderColor: file ? "#10B981" : "rgba(240, 98, 146, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(240, 98, 146, 0.05)",
                      borderColor: "#E53888",
                    },
                  }}
                  component='label'
                >
                  <input
                    type='file'
                    accept='image/*,application/pdf'
                    hidden
                    onChange={handleFileChange}
                  />
                  {file ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CheckCircle sx={{ color: "#10B981", fontSize: 36 }} />
                      <Typography
                        variant='subtitle2'
                        sx={{ color: "#10B981", fontWeight: 700 }}
                      >
                        ¡Archivo Cargado!
                      </Typography>
                      <Typography
                        variant='caption'
                        color='textSecondary'
                        sx={{ maxWidth: 280, noWrap: true }}
                      >
                        {fileNamePreview}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CloudUpload
                        sx={{ color: "#E53888", fontSize: 16, opacity: 0.8 }}
                      />
                      <Typography
                        variant='subtitle2'
                        sx={{ color: "#2A2628", fontWeight: 500 }}
                      >
                        Sube una foto o PDF del ticket
                      </Typography>
                      <Typography variant='caption' color='textSecondary'>
                        Formatos admitidos: JPG, PNG o PDF (Máx. 5MB)
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        {/* ACCIONES */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            disabled={isSaving}
            sx={{
              borderRadius: "12px",
              color: "#6B6567",
              fontWeight: "bold",
              px: 3,
            }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isSaving}
            sx={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #E53888 0%, #ff6fa5 100%)",
              fontWeight: "bold",
              px: 4,
              py: 1.2,
              boxShadow: "0px 8px 24px rgba(229, 56, 136, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #cc2e75 0%, #e0568c 100%)",
              },
            }}
          >
            {isSaving ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "#fff" }} />
                <span>Guardando...</span>
              </Box>
            ) : (
              "Guardar Gasto"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddExpenseModal;
