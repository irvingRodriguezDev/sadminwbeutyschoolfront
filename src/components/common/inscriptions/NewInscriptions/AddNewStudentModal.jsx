import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { supabase } from "../../../../config/supabaseClient";
import { useStudents } from "../../../../context/StudentsContext";
import { alerts } from "../../../../utils/alerts";

// 🚀 Añadimos 'onStudentCreated' en las props para avisarle al formulario padre quién se registró
const AddNewStudentModal = ({ open, onClose, schoolId, onStudentCreated }) => {
  const { fetchStudents } = useStudents();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      // El truco para modales encimados: forzar un z-index controlado si es necesario
      sx={{ zIndex: 1400 }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#E63988" }}>
        ✨ Registrar Nueva Alumna
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label='Nombre Completo'
            id='modal-name'
            autoComplete='off'
            fullWidth
            required
          />
          <TextField
            label='Teléfono (WhatsApp)'
            id='modal-phone'
            fullWidth
            autoComplete='off'
            required
          />
          <TextField
            label='Correo Electrónico'
            id='modal-email'
            autoComplete='off'
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button
          variant='contained'
          sx={{
            backgroundColor: "#E63988",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { backgroundColor: "#BE3C77" },
          }}
          onClick={async () => {
            const name = document.getElementById("modal-name").value;
            const phone = document.getElementById("modal-phone").value;
            const email = document.getElementById("modal-email").value;

            if (!name || !phone) {
              // Si tu utilería de alertas usa SweetAlert, puedes cambiar este por un alert nativo
              // temporalmente para que no se esconda detrás, o usar el Toast de SweetAlert.
              alerts.error("Por favor llena los campos obligatorios.");
              return;
            }

            try {
              // 1. Guardar directo en Supabase
              const { data: newStudent, error } = await supabase
                .from("students")
                .insert({ school_id: schoolId, name, phone, email })
                .select()
                .single();

              if (error) throw error;

              // 2. 🔄 Actualizar la lista global de estudiantes del contexto
              await fetchStudents(schoolId);

              // 3. 🎯 Escalamos el éxito al formulario padre de forma segura
              if (onStudentCreated) {
                onStudentCreated(newStudent);
              }

              // 4. 🔥 SOLUCON AL OVERLAY: Usamos el modo Toast nativo de SweetAlert2 (si tu utilería lo soporta)
              // O en su defecto, cerramos primero el modal y dejamos la notificación limpia.
              onClose();

              // Si tu archivo 'alerts' tiene configuración de Toast, úsala. Si no, un mixin rápido:
              alerts.success("¡Alumna registrada con éxito!");
              // Si no tienes configurado un Toast, un aviso discreto en pantalla basta:
            } catch (err) {
              alerts.error("Error al registrar alumna: " + err.message);
            }
          }}
        >
          Guardar Alumna
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewStudentModal;
