import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";

const BuscadorGlobal = ({
  search,
  setSearch,
  placeholder = "Buscar...",
  maxWidth = "800px",
}) => {
  return (
    <Box sx={{ mb: 4, maxWidth }}>
      <TextField
        fullWidth
        label={placeholder}
        variant='outlined'
        value={search}
        autoComplete='off'
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            sx: {
              borderRadius: "12px",
              backgroundColor: "#fff",
              // Añadimos una sutil sombra premium en hover/focus
              "&:hover": { boxShadow: "0 2px 8px rgba(240, 98, 146, 0.15)" },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(240, 98, 146, 0.2)",
              },
            },
            // Opcional: Puedes meter un icono de lupa si quieres sumarle puntos estéticos
            endAdornment: (
              <InputAdornment position='end' sx={{ color: "#F06292", mr: 0.5 }}>
                🔍
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default BuscadorGlobal;
