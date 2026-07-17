import React, { useEffect } from "react";
import Select from "react-select";
import { useStudents } from "../../context/StudentsContext";
import { useAuth } from "../../context/AuthContext";
import { Box, Typography, Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const SelectStudents = (props) => {
  const { students, fetchStudents } = useStudents();
  const { profile } = useAuth();

  // Cargar estudiantes al montar el componente si existe el school_id
  useEffect(() => {
    if (profile?.school_id) {
      fetchStudents(profile.school_id);
    }
  }, [profile?.school_id, fetchStudents]);

  const detectarCambiosStudent = (value) => {
    props.detectarCambiosStudent(value);
  };
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FDE7EF", // Fondo rosa pastel suave idéntico al de direcciones
      borderColor: state.isFocused ? "#E53888" : "#F9C4D9",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(229, 56, 136, 0.3)" : "none",
      borderRadius: 8, // Bordes redondeados elegantes
      minHeight: "50px", // Consistencia de altura con MUI
      padding: "0 6px",
      cursor: "pointer",
      transition: "all .20s ease",
      "&:hover": { borderColor: "#E53888" },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#BE3C77", // Tono rosa oscuro legible para guiar al usuario
      fontWeight: 500,
    }),

    singleValue: (base) => ({
      ...base,
      color: "#BE3C77",
      fontWeight: 600,
    }),

    dropdownIndicator: (base, state) => ({
      ...base,
      color: "#E53888",
      ":hover": { color: "#BE3C77" },
    }),

    clearIndicator: (base) => ({
      ...base,
      color: "#F9C4D9",
      ":hover": { color: "#E53888" },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#FDE7EF",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      zIndex: 1500, // Nos aseguramos de que flote sobre cualquier elemento del modal
      overflow: "hidden",
    }),

    // ✨ AQUÍ EL TRUCO: Modificamos el contenedor de la lista y estilizamos el scroll
    menuList: (base) => ({
      ...base,
      padding: "6px",

      // 🌸 Personalización total de la barra de desplazamiento (Scrollbar)
      "::-webkit-scrollbar": {
        width: "8px", // La hacemos mucho más delgada que la nativa
      },
      "::-webkit-scrollbar-track": {
        background: "#FDE7EF", // Fondo del carril igual al del menú para que se camufle
      },
      "::-webkit-scrollbar-thumb": {
        background: "#F9C4D9", // La barrita que se mueve será rosa pastel
        borderRadius: "10px", // Bordes completamente circulares
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#E53888", // Cambia al rosa fucsia vibrante cuando le pasas el mouse
      },
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#E53888" // Fondo fucsia si está seleccionado
        : state.isFocused
          ? "#F9C4D9" // Fondo rosa intermedio en hover
          : "#FDE7EF", // Fondo rosa pastel por defecto
      color: state.isSelected ? "white" : "#444",
      borderRadius: 8,
      margin: "4px 0",
      padding: "12px 16px",
      cursor: "pointer",
      transition: "all .15s ease",
      wordBreak: "break-word",
    }),
  };
  // Mapear el arreglo de estudiantes al formato requerido por react-select { value, label }
  const options = (students || []).map((student) => ({
    value: student.id,
    label: `${student.name} 📞 (${student.phone})`,
    data: student, // Guardamos el objeto completo para recuperarlo en el onChange
  }));

  // Encontrar la opción seleccionada actualmente en base al ID que viene del padre

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Select
            placeholder='Buscar por nombre o teléfono...'
            isClearable
            options={options}
            onChange={detectarCambiosStudent}
            styles={customStyles}
            noOptionsMessage={() => "No se encontraron alumnas"}
            loadingMessage={() => "Buscando..."}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SelectStudents;
