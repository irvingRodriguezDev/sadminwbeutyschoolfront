import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../../config/supabaseClient";
import { useSchool } from "../../../context/SchoolContext"; // Importamos el contexto
import { alerts } from "../../../utils/alerts";

const AltaSalon = ({ open, onClose }) => {
  const { school, refreshSchoolData } = useSchool(); // Obtenemos el ID de la escuela y la función de refresco
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad: 10,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("salones").insert([
        {
          school_id: school.id, // Viene directamente del contexto
          nombre: formData.nombre,
          capacidad: parseInt(formData.capacidad),
        },
      ]);

      if (error) throw error;

      // IMPORTANTE: Refrescamos los datos del contexto para que la lista se actualice sola
      await refreshSchoolData();

      onClose();
      alerts.success(
        "¡Salón Creado!",
        `El salón "${formData.nombre}" se agregó correctamente.`,
      );
      setFormData({ nombre: "", capacidad: 10 });
    } catch (error) {
      alerts.error("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle
        sx={{ fontWeight: "bold", color: "#f06292", textAlign: "center" }}
      >
        Añadir Salón a {school?.name} 🌸
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label='Nombre del Salón'
              required
              autoComplete='off'
              placeholder='Ej. Salón de Manicura Pro'
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <TextField
              fullWidth
              label='Capacidad de Alumnas'
              type='number'
              required
              value={formData.capacidad}
              onChange={(e) =>
                setFormData({ ...formData, capacidad: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button onClick={onClose} disabled={loading} color='inherit'>
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            sx={{ bgcolor: "#f06292", borderRadius: "10px", px: 4 }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              "Guardar Salón"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AltaSalon;
