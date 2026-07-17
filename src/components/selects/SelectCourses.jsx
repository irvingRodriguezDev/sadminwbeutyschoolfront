import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useCursos } from "../../context/CursoContext";
import { FormatCurrency } from "../../utils/FormatCurrency";
import { useAuth } from "../../context/AuthContext";
import FormatDate from "../../utils/FormatDate";

const SelectCourses = (props) => {
  const { profile } = useAuth();
  const { fetchCursos } = useCursos();
  const [options, setOptions] = useState([]);

  const detectarCambiosCursos = (value) => {
    // react-select entrega el objeto completo { value, label, slots_left },
    // pasamos solo el ID al padre para no romper tu handleCourseChange original
    props.detectarCambiosCursos(value ? value.value : null);
  };

  useEffect(() => {
    const loadSelectOptions = async () => {
      const res = await fetchCursos(profile.school_id, { isSelect: true });

      if (!res?.courses) return;

      // ⏰ Control del tiempo real (Zona Horaria México)
      // Creamos la fecha de "hoy" a la medianoche (00:00:00) para comparar limpiamente solo días
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // 🌸 Filtramos y mapeamos en un solo paso con el estándar premium de Wapizima
      const cursosValidos = res.courses
        .filter((c) => {
          if (!c.fecha_inicio) return false;

          // Forzamos el parseo local a medianoche para evitar desfases de zona horaria por el string ISO
          const fechaCurso = new Date(`${c.fecha_inicio}T00:00:00`);
          fechaCurso.setHours(0, 0, 0, 0);

          // 🎯 Al comparar a nivel de medianoche (00:00:00), un curso que empieza hoy
          // se mantendrá visible e igual (fechaCurso >= hoy) durante todo el día actual
          // hasta que el reloj marque las 00:00:00 del día siguiente.
          return fechaCurso >= hoy;
        })
        .map((c) => {
          const capacidad = c.salon?.capacidad || 0;
          const activos = c.enrollments?.length || 0;
          const slotsLeft = capacidad - activos;

          return {
            value: c.id,
            // Tag dinámico ultra claro si el cupo está lleno para que resalte a la vista
            label: `${c.tipo_curso} - ${c.titulo} - (${FormatCurrency(c.costo)}) - ${c.fecha_inicio} ${
              slotsLeft <= 0 ? "⚠️ ¡CUPO LLENO!" : ""
            }`,
            slots_left: slotsLeft,
          };
        });

      setOptions(cursosValidos);
    };

    if (profile?.school_id) loadSelectOptions();
  }, [profile?.school_id, fetchCursos]);

  // 🎨 ESTILOS PREMIUM (Mantenemos tus hermosas transiciones y scroll rosa)
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "12px",
      borderColor: state.isFocused ? "#E53888" : "rgba(240, 98, 146, 0.3)",
      boxShadow: state.isFocused
        ? "0 4px 12px rgba(229, 56, 136, 0.15)"
        : "none",
      padding: "4px 6px",
      backgroundColor: "#fff",
      transition: "all 0.2s ease-in-out",
      "&:hover": { borderColor: "#E53888" },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#B29EA6",
      fontSize: "0.95rem",
      fontWeight: 500,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#2D2D2D",
      fontWeight: 600,
      fontSize: "0.95rem",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#E53888" : "rgba(240, 98, 146, 0.6)",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "rgba(240, 98, 146, 0.15)",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1000,
      borderRadius: "14px",
      boxShadow: "0px 10px 30px rgba(229, 56, 136, 0.08)",
      border: "1px solid rgba(240, 98, 146, 0.12)",
      overflow: "hidden",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "6px",
      "&::-webkit-scrollbar": { width: "6px" },
      "&::-webkit-scrollbar-track": { background: "transparent" },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(229, 56, 134, 0.3)",
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(229, 56, 134, 0.6)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px 16px",
      fontSize: "0.9rem",
      fontWeight: state.isSelected ? 700 : 500,
      borderRadius: "8px",
      mb: "2px",
      // 🚫 Si la opción está deshabilitada (curso lleno), la pintamos gris suave
      backgroundColor: state.isDisabled
        ? "#F5F5F5"
        : state.isSelected
          ? "#E53888"
          : state.isFocused
            ? "#FFF1F6"
            : "white",
      color: state.isDisabled
        ? "#999999"
        : state.isSelected
          ? "white"
          : state.isFocused
            ? "#E53888"
            : "#2D2D2D",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
    }),
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Select
            placeholder='Buscar o seleccionar curso...'
            isClearable
            options={options}
            onChange={detectarCambiosCursos}
            styles={customStyles}
            // 🚫 REGLA 2: Bloquear opciones si el remanente de lugares llegó a cero
            isOptionDisabled={(option) => option.slots_left <= 0}
            noOptionsMessage={() => "No hay cursos vigentes activos"}
            loadingMessage={() => "Buscando catálogo..."}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SelectCourses;
