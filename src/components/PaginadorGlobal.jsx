import React from "react";
import { Pagination, Stack } from "@mui/material";

const PaginadorGlobal = ({ totalPages, currentPage, onPageChange }) => {
  // Si no hay páginas o es solo 1, no renderiza nada para mantener la UI limpia
  if (!totalPages || totalPages <= 1) return null;

  return (
    <Stack spacing={2} sx={{ mt: 5, alignItems: "center" }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => onPageChange(value)} // Devuelve directo el número de página limpio
        variant='outlined'
        shape='rounded'
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "8px",
            borderColor: "#F9C4D9",
            color: "#BE3C77",
            fontWeight: 500,
            "&.Mui-selected": {
              backgroundColor: "#F06292",
              color: "#fff",
              fontWeight: 700,
              borderColor: "#F06292",
              "&:hover": { backgroundColor: "#E2208C" },
            },
            "&:hover": {
              backgroundColor: "#FFF9FA",
              borderColor: "#F06292",
            },
          },
        }}
      />
    </Stack>
  );
};

export default PaginadorGlobal;
