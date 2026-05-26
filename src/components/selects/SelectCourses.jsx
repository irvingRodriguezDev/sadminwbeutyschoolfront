import { Box } from "@mui/material";
import React, { useEffect } from "react";
import Select from "react-select";
import { useCursos } from "../../context/CursoContext";
import { FormatCurrency } from "../../utils/FormatCurrency";
const SelectCourses = (props) => {
  const { cursos, refreshCursos } = useCursos();
  const detectarCambiosCursos = (value) => {
    props.detectarCambiosCursos(value);
  };
  useEffect(() => {
    refreshCursos();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#E53888" : "#E53888",
      boxShadow: state.isFocused ? "0 0 0 1px #E53888" : "none",
      "&:hover": {
        borderColor: "#E53888",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#E53888", // color del placeholder
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black", // texto seleccionado
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#E53888" : "#E53888",
      "&:hover": {
        color: "#E53888",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#E53888"
        : state.isFocused
          ? "#f0f0f0"
          : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: state.isSelected ? "#E53888" : "#f5f5f5",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const options = (cursos || []).map((c) => ({
    value: c.id,
    label: `${c.tipo_curso} - ${c.titulo} - (${FormatCurrency(c.costo)})`,
    data: c, // Guardamos el objeto completo para recuperarlo en el onChange
  }));
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Select
            placeholder='Buscar curso'
            isClearable
            options={options}
            onChange={detectarCambiosCursos}
            styles={customStyles}
            noOptionsMessage={() => "No se encontraron alumnas"}
            loadingMessage={() => "Buscando..."}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SelectCourses;
