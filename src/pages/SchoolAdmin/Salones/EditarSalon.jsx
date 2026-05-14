import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

const EditarSalon = ({ open, onClose, salon }) => {
  const [formData, setFormData] = useState({
    nombre: salon?.nombre || "",
    capacidad: salon?.capacidad || "",
    descripcion: salon?.descripcion || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("salones")
        .update({
          nombre: formData.nombre,
          capacidad: parseInt(formData.capacidad),
          descripcion: formData.descripcion,
        })
        .eq("id", salon.id);

      if (error) throw error;

      alerts.success("Actualizado", "Los datos del salón se han modificado.");
      onClose();
      refreshSalones();
    } catch (error) {
      alerts.error("Error", error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle sx={{ color: "#f06292", fontWeight: "bold" }}>
        Editar Salón
      </DialogTitle>
      <form onSubmit={handleUpdate}>
        <DialogContent>
          <TextField
            fullWidth
            label='Nombre'
            autoComplete='off'
            sx={{ mb: 2 }}
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <TextField
            fullWidth
            label='Capacidad Alumnas'
            type='number'
            autoComplete='off'
            sx={{ mb: 2 }}
            value={formData.capacidad}
            onChange={(e) =>
              setFormData({ ...formData, capacidad: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type='submit' variant='contained' sx={{ bgcolor: "#f06292" }}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditarSalon;
